import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { Specialist, SpecialistFilters, SpecialistState } from '../../types/specialist';

const BASE = '/specialists';

const store = create<SpecialistState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 10,
    total: 0,
    allData: [],

    // GET /specialists
    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters);
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
            showError('Failed to fetch specialists');
        } finally {
            set({ isLoading: false });
        }
    },

    // GET /specialists/verified
    fetchVerified: async () => {
        try {
            const response = await doGET(`${BASE}/verified`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data ?? [];
            } else {
                showError(response.message);
                return [];
            }
        } catch (err) {
            showError('Failed to fetch verified specialists');
            return [];
        }
    },

    // GET /specialists/specialization/:specialization
    fetchBySpecialization: async (specialization: string) => {
        try {
            const response = await doGET(`${BASE}/specialization/${specialization}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data ?? [];
            } else {
                showError(response.message);
                return [];
            }
        } catch (err) {
            showError('Failed to fetch specialists by specialization');
            return [];
        }
    },

    setFilters: (newFilters: SpecialistFilters) => {
        set({ filters: newFilters, currentPage: 1 });
        get().fetchGrid();
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

    // POST /specialists
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

    // PUT /specialists/:id
    onUpdate: async (data: Specialist) => {
        try {
            const id = data._id;
            if (!id) {
                showError('Specialist ID is required for update');
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

    // DELETE /specialists/:id
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

    // GET /specialists/:id
    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE}/${id}`);
            return response.data;
        } catch (error) {

        }
    }
}));

export const useSpecialistStore = () => store((state) => state);
