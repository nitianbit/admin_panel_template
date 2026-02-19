import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ENDPOINTS } from '../api/constants';
import { HealthTip, HealthTipFilters, HealthTipState } from '../../types/healthTips';
import { MODULES } from '../../utils/constants';

const store = create<HealthTipState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 20,
    total: 0,
    allData: [],

    fetchGrid: async (page?: number, filters?: HealthTipFilters) => {
        try {
            const state = get();
            const currentPage = page ?? state.currentPage;
            const currentFilters = filters ?? state.filters;

            if (state.isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(currentFilters);
            queryParams.append('page', String(currentPage));
            queryParams.append('rows', String(state.rows));
            const apiUrl = `${ENDPOINTS.grid(MODULES.HEALTH_TIP)}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({
                    data: response.data.data.rows,
                    total: response.data.data.total ?? 0,
                    totalPages: Math.ceil((response.data.data.total ?? 0) / state.rows),
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

    setFilters: (newFilters: HealthTipFilters) => {
        set({ filters: newFilters, currentPage: 1 });
        get().fetchGrid(1, newFilters);
    },

    nextPage: () => {
        const { currentPage, totalPages, fetchGrid } = get();
        if (currentPage < totalPages) {
            const next = currentPage + 1;
            set({ currentPage: next });
            fetchGrid(next);
        }
    },

    prevPage: () => {
        const { currentPage, fetchGrid } = get();
        if (currentPage > 1) {
            const prev = currentPage - 1;
            set({ currentPage: prev });
            fetchGrid(prev);
        }
    },

    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        const next = page + 1;
        set({ currentPage: next });
        get().fetchGrid(next);
    },

    onCreate: async (data: HealthTip) => {
        try {
            const response = await doPOST(ENDPOINTS.create(MODULES.HEALTH_TIP), data);
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

    onUpdate: async (data: HealthTip) => {
        try {
            const response = await doPUT(ENDPOINTS.update(MODULES.HEALTH_TIP), data);
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

    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete(MODULES.HEALTH_TIP, id));
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete health tip');
            }
        } catch (error) {
            showError('Error deleting health tip');
        }
    },

    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail(MODULES.HEALTH_TIP, id));
            return response.data;
        } catch (error) {
            showError('Failed to fetch health tip details');
            throw error;
        }
    }
}));

export const useHealthTipStore = () => store((state) => state);
