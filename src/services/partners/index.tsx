import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError, showSuccess } from '../toaster';
import { PartnerData, PartnerFilters, PartnerState } from '../../types/partners';
import { ENDPOINTS } from '../api/constants';
import { MODULES } from '../../utils/constants';

const store = create<PartnerState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 20,
    total: 0,
    allData: [],

    fetchGrid: async (page?: number, filters?: PartnerFilters) => {
        try {
            const state = get();
            const currentPage = page ?? state.currentPage;
            const currentFilters = filters ?? state.filters;

            if (state.isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(currentFilters);
            queryParams.append('page', String(currentPage));
            queryParams.append('rows', String(state.rows));
            const apiUrl = `${ENDPOINTS.grid(MODULES.PARTNER)}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({
                    data: response.data.data.rows,
                    total: response.data.data.total ?? 0,
                    totalPages: Math.ceil((response.data.data.total ?? 0) / state.rows),
                });
            } else {
                showError(response.message || 'Failed to fetch partners');
            }
        } catch (err) {
            showError('Failed to fetch partners');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: PartnerFilters) => {
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

    onCreate: async (data: PartnerData) => {
        try {
            const response = await doPOST(ENDPOINTS.create(MODULES.PARTNER), data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
                showSuccess("Partner created successfully");
                return response?.data?.data;
            } else {
                showError(response.message || 'Failed to create partner');
            }
            return null;
        } catch (error) {
            showError('Error creating partner');
            return null;
        }
    },

    onUpdate: async (data: PartnerData) => {
        try {
            const response = await doPUT(ENDPOINTS.update(MODULES.PARTNER), data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
                showSuccess("Partner updated successfully");
                return response?.data?.data;
            } else {
                showError(response.message || 'Failed to update partner');
            }
            return null;
        } catch (error) {
            showError('Error updating partner');
            return null;
        }
    },

    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete(MODULES.PARTNER, id));
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
                showSuccess("Partner deleted successfully");
            } else {
                showError(response.message || 'Failed to delete partner');
            }
        } catch (error) {
            showError('Error deleting partner');
        }
    },

    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail(MODULES.PARTNER, id));
            return response.data;
        } catch (error) {
            showError('Failed to fetch partner details');
            throw error;
        }
    }
}));

export const usePartnerStore = () => store((state) => state);
