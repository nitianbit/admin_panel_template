import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ISlot, CreateSlotRequest, SlotQueryParams, SlotState } from '../../types/slots';
import { ENDPOINTS } from '../api/constants';

const store = create<SlotState>((set, get) => ({
    data: [],
    totalPages: 0,
    total: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    limit: 10,

    fetchGrid: async () => {
        try {
            const { filters, currentPage, limit, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters as any);
            queryParams.append('page', String(currentPage));
            queryParams.append('limit', String(limit));

            const apiUrl = `${ENDPOINTS.grid('slots')}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({
                    data: response.data.data.rows,
                    ...(currentPage === 1 && {
                        totalPages: Math.ceil((response.data.data.total ?? 0) / limit),
                        total: response.data.data.total ?? 0
                    }),
                });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError('Failed to fetch slots');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: SlotQueryParams) => {
        set({ filters: newFilters, currentPage: 1 });
        get().fetchGrid();
    },

    nextPage: () => {
        const { currentPage, totalPages, fetchGrid } = get();
        if (currentPage < totalPages) {
            set(state => ({
                currentPage: state.currentPage + 1
            }));
            fetchGrid();
        }
    },

    prevPage: () => {
        const { currentPage, fetchGrid } = get();
        if (currentPage > 1) {
            set(state => ({
                currentPage: state.currentPage - 1
            }));
            fetchGrid();
        }
    },

    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        const { totalPages } = get();
        // Assuming page comes from a 0-indexed component like MUI TablePagination,
        // but if it's 1-indexed (like Pagination), we might need adjustment.
        // Appointment service used page + 1, implying 0-indexed input.
        const newPage = page + 1;
        if (newPage >= 1 && newPage <= totalPages) {
            set({
                currentPage: newPage
            });
            get().fetchGrid();
        }
    },

    onCreate: async (data: CreateSlotRequest) => {
        try {
            const response = await doPOST(ENDPOINTS.create('slots'), data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to create slot');
            }
        } catch (error) {
            showError('Failed to create slot');
        }
    },

    onUpdate: async (data: ISlot) => {
        try {
            const response = await doPUT(ENDPOINTS.update('slots'), data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to update slot');
            }
        } catch (error) {
            showError('Failed to update slot');
        }
    },

    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete('slots', id));
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete slot');
            }
        } catch (error) {
            showError('Failed to delete slot');
        }
    },

    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail('slots', id));
            if (response.status >= 200 && response.status < 400) {
                return response.data;
            } else {
                showError(response.message || 'Failed to fetch slot details');
                return null;
            }
        } catch (error) {
            showError('Failed to fetch slot details');
            return null;
        }
    }
}));

export const useSlotStore = () => store((state) => state);
