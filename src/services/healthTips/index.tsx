import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { HealthTip, HealthTipFilters, HealthTipState } from '../../types/healthTips';

const BASE = '/health-tips';

const store = create<HealthTipState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 20,
    total: 0,
    allData: [],

    // GET /health-tips
    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters as any);
            queryParams.append('page', String(currentPage));
            queryParams.append('limit', String(rows));

            const apiUrl = `${BASE}?${queryParams.toString()}`;
            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                const resData = response.data?.data;
                set({
                    data: resData?.rows ?? resData ?? [],
                    total: resData?.total ?? 0,
                    totalPages: Math.ceil((resData?.total ?? 0) / rows),
                });
            } else {
                showError(response.message || 'Failed to fetch health tips');
            }
        } catch (err) {
            showError('Failed to fetch health tips');
        } finally {
            set({ isLoading: false });
        }
    },

    // GET /health-tips/active
    fetchActive: async () => {
        try {
            const response = await doGET(`${BASE}/active`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data ?? [];
            } else {
                showError(response.message);
                return [];
            }
        } catch (err) {
            showError('Failed to fetch active health tips');
            return [];
        }
    },

    // GET /health-tips/category/:category
    fetchByCategory: async (category: string) => {
        try {
            const response = await doGET(`${BASE}/category/${category}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data ?? [];
            } else {
                showError(response.message);
                return [];
            }
        } catch (err) {
            showError('Failed to fetch health tips by category');
            return [];
        }
    },

    setFilters: (newFilters: HealthTipFilters) => {
        set({ filters: newFilters, currentPage: 1 });
        get().fetchGrid();
    },

    nextPage: () => {
        const { currentPage, totalPages, fetchGrid } = get();
        if (currentPage < totalPages) {
            set(state => ({ currentPage: state.currentPage + 1 }));
            fetchGrid();
        }
    },

    prevPage: () => {
        const { currentPage, fetchGrid } = get();
        if (currentPage > 1) {
            set(state => ({ currentPage: state.currentPage - 1 }));
            fetchGrid();
        }
    },

    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        const { currentPage, fetchGrid, totalPages } = get();
        if (currentPage > 1 || currentPage <= totalPages) {
            set({ currentPage: page + 1 });
            fetchGrid();
        }
    },

    // POST /health-tips
    onCreate: async (data: HealthTip) => {
        try {
            const response = await doPOST(BASE, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
                return response?.data?.data;
            } else {
                showError(response.message || 'Failed to create health tip');
            }
            return null;
        } catch (error) {
            showError('Error creating health tip');
            return null;
        }
    },

    // PUT /health-tips/:id
    onUpdate: async (data: HealthTip) => {
        try {
            const id = data._id;
            if (!id) {
                showError('Health Tip ID is required for update');
                return null;
            }
            const response = await doPUT(`${BASE}/${id}`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
                return response?.data?.data;
            } else {
                showError(response.message || 'Failed to update health tip');
            }
            return null;
        } catch (error) {
            showError('Error updating health tip');
            return null;
        }
    },

    // DELETE /health-tips/:id
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(`${BASE}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete health tip');
            }
        } catch (error) {
            showError('Error deleting health tip');
        }
    },

    // GET /health-tips/:id
    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE}/${id}`);
            return response.data;
        } catch (error) {
            showError('Failed to fetch health tip details');
            throw error;
        }
    }
}));

export const useHealthTipStore = () => store((state) => state);

