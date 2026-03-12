import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { WellnessPackage, WellnessPackageFilters, WellnessPackageState } from '../../types/WellnessPackage';

const BASE = '/wellness-packages';
const CORPORATE_BASE = '/corporates';

const store = create<WellnessPackageState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 10,
    total: 0,
    allData: [],

    // GET /wellness-packages?isActive=true&isPopular=true&page=1&limit=10 (global or filtered)
    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams();
            // Add filter params: isActive, isPopular, corporateId, etc.
            if (filters.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
            if (filters.isPopular !== undefined) queryParams.append('isPopular', String(filters.isPopular));
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.corporateId) queryParams.append('corporateId', filters.corporateId);
            queryParams.append('page', String(currentPage));
            queryParams.append('limit', String(rows));

            const apiUrl = `${BASE}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                const resData = response.data?.data;
                const pagination = response.data?.pagination;
                set({
                    data: resData ?? [],
                    totalPages: pagination?.totalPages ?? 1,
                    total: pagination?.total ?? 0,
                });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError('Failed to fetch wellness packages');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: WellnessPackageFilters) => {
        set({ filters: newFilters, currentPage: 1 });
        get().fetchGrid();
    },

    // GET /corporates/:id/wellness-packages (list for one corporate, no pagination)
    fetchByCorporate: async (corporateId: string) => {
        try {
            const response = await doGET(`${CORPORATE_BASE}/${corporateId}/wellness-packages`);
            if (response.status >= 200 && response.status < 400) {
                const resData = response.data?.data;
                const normalized = Array.isArray(resData) ? resData : [];
                set({
                    data: normalized,
                    total: normalized.length,
                    totalPages: 1,
                    currentPage: 1,
                });
                return normalized;
            } else {
                showError(response.message || 'Failed to fetch wellness packages for corporate');
                set({ data: [], total: 0, totalPages: 1, currentPage: 1 });
                return [];
            }
        } catch (err) {
            showError('Failed to fetch wellness packages for corporate');
            set({ data: [], total: 0, totalPages: 1, currentPage: 1 });
            return [];
        }
    },

    nextPage: () => {
        const { currentPage, totalPages, fetchGrid } = get();
        if (currentPage < totalPages) {
            set(state => ({
                currentPage: state.currentPage + 1
            }))
            fetchGrid();
        }
    },

    prevPage: () => {
        const { currentPage, fetchGrid } = get();
        if (currentPage > 1) {
            set(state => ({
                currentPage: state.currentPage - 1
            }))
            fetchGrid();
        }
    },

    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        const { currentPage, fetchGrid, totalPages } = get();
        if (currentPage > 1 || currentPage <= totalPages) {
            set({
                currentPage: page + 1
            })
            fetchGrid();
        }
    },

    // POST /wellness-packages
    onCreate: async (data: any) => {
        try {
            const response = await doPOST(BASE, data);
            console.log(response);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
            return response?.data?.data
        } catch (error) {
            return null
        }
    },

    // PUT /wellness-packages/:id
    onUpdate: async (data: WellnessPackage) => {
        try {
            const id = data._id;
            if (!id) {
                showError('Wellness Package ID is required for update');
                return null;
            }
            const response = await doPUT(`${BASE}/${id}`, data);
            console.log(response);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
            return response?.data?.data
        } catch (error) {
            return null
        }
    },

    // DELETE /wellness-packages/:id
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(`${BASE}/${id}`);
            console.log(response);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
        } catch (error) {

        }
    },

    // GET /wellness-packages/:id
    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE}/${id}`);
            return response.data;
        } catch (error) {

        }
    }
}));

export const useWellnessPackageStore = () => store((state) => state);

