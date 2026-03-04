import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError, showSuccess } from '../toaster';
import { PartnerData, PartnerFilters, PartnerState } from '../../types/partners';

const BASE = '/partners';

const store = create<PartnerState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 10,
    total: 0,
    allData: [],

    // GET /partners
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
                const pagination = response.data?.pagination;
                set({
                    data: resData ?? [],
                    totalPages: pagination?.totalPages ?? 1,
                    total: pagination?.total ?? 0,
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

    // GET /partners/verified
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
            showError('Failed to fetch verified partners');
            return [];
        }
    },

    // GET /partners/type/:partnerType
    fetchByType: async (partnerType: string) => {
        try {
            const response = await doGET(`${BASE}/type/${partnerType}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data ?? [];
            } else {
                showError(response.message);
                return [];
            }
        } catch (err) {
            showError('Failed to fetch partners by type');
            return [];
        }
    },

    setFilters: (newFilters: PartnerFilters) => {
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

    // POST /partners
    onCreate: async (data: PartnerData) => {
        try {
            const response = await doPOST(BASE, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
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

    // PUT /partners/:id
    onUpdate: async (data: PartnerData) => {
        try {
            const id = data._id;
            if (!id) {
                showError('Partner ID is required for update');
                return null;
            }
            const response = await doPUT(`${BASE}/${id}`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
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

    // DELETE /partners/:id
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(`${BASE}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete partner');
            }
        } catch (error) {
            showError('Error deleting partner');
        }
    },

    // GET /partners/:id
    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE}/${id}`);
            return response.data;
        } catch (error) {
            showError('Failed to fetch partner details');
            throw error;
        }
    }
}));

export const usePartnerStore = () => store((state) => state);

