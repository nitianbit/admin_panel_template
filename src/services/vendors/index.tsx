import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ENDPOINTS } from '../api/constants';
import { VendorState, VendorFilters, Vendor } from '../../types/vendors';
import { MODULES } from '../../utils/constants';

const store = create<VendorState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 20,
    total: 0,
    allData: [],

    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters);
            queryParams.append('page', String(currentPage));
            queryParams.append('rows', String(rows));
            const apiUrl = `${ENDPOINTS.grid(MODULES.VENDORS)}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({
                    data: response.data.data.rows,
                    ...(currentPage == 1 && { totalPages: Math.ceil(response.data.data.total / rows), total: response.data.data.total ?? 0 }),
                });
            } else {
                showError(response.message);
            }
        } catch {
            showError('Failed to fetch Vendors');
        } finally {
            set({ isLoading: false });
        }
    },

    fetchGridAll: async (filters: VendorFilters) => {
        try {
            const { allData } = get();
            if (allData.length > 0) return allData;
            const queryParams = new URLSearchParams(filters);
            queryParams.append('rows', String(-1));
            const apiUrl = `${ENDPOINTS.grid(MODULES.VENDORS)}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({ allData: response.data.data.rows });
            }
            return get().allData;
        } catch {
            showError('Failed to fetch Vendors');
            return get().allData;
        }
    },

    setFilters: (newFilters: VendorFilters) => {
        set({ filters: newFilters, currentPage: 1 });
        get().fetchGrid();
    },

    nextPage: () => {
        const { currentPage, totalPages, fetchGrid } = get();
        if (currentPage < totalPages) {
            set({ currentPage: currentPage + 1 });
            fetchGrid();
        }
    },

    prevPage: () => {
        const { currentPage, fetchGrid } = get();
        if (currentPage > 1) {
            set({ currentPage: currentPage - 1 });
            fetchGrid();
        }
    },

    onPageChange: (_e, page: number) => {
        set({ currentPage: page + 1 });
        get().fetchGrid();
    },

    onCreate: async (data: Vendor) => {
        try {
            const response = await doPOST(ENDPOINTS.create(MODULES.VENDORS), data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
            return response?.data?.data;
        } catch {
            return null;
        }
    },

    onUpdate: async (data: Vendor) => {
        try {
            const response = await doPUT(ENDPOINTS.update(MODULES.VENDORS), data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
            return response?.data?.data;
        } catch {
            return null;
        }
    },

    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete(MODULES.VENDORS, id));
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
        } catch { }
    },

    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail(MODULES.VENDORS, id));
            return response.data;
        } catch { }
    }
}));

export const useVendorStore = () => store((state) => state);
