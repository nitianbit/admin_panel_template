import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import {
    ICorporate,
    CreateCorporateRequest,
    UpdateCorporateRequest,
    CorporateQueryParams,
    CorporateState
} from '../../types/corporates';
import { ENDPOINTS } from '../api/constants';
import { MODULES } from '../../utils/constants';

const store = create<CorporateState>((set, get) => ({
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

            const apiUrl = `${ENDPOINTS.grid(MODULES.CORPORATE)}?${queryParams.toString()}`;

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
            showError('Failed to fetch corporates');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: CorporateQueryParams) => {
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
        const newPage = page + 1;
        if (newPage >= 1 && newPage <= totalPages) {
            set({
                currentPage: newPage
            });
            get().fetchGrid();
        }
    },

    onCreate: async (data: CreateCorporateRequest) => {
        try {
            const response = await doPOST(ENDPOINTS.create(MODULES.CORPORATE), data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to create corporate');
            }
        } catch (error) {
            showError('Failed to create corporate');
        }
    },

    onUpdate: async (id: string, data: UpdateCorporateRequest) => {
        try {
            const response = await doPUT(ENDPOINTS.update(MODULES.CORPORATE), { ...data, _id: id });
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to update corporate');
            }
        } catch (error) {
            showError('Failed to update corporate');
        }
    },

    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete(MODULES.CORPORATE, id));
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete corporate');
            }
        } catch (error) {
            showError('Failed to delete corporate');
        }
    },

    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail(MODULES.CORPORATE, id));
            if (response.status >= 200 && response.status < 400) {
                return response.data;
            } else {
                showError(response.message || 'Failed to fetch corporate details');
                return null;
            }
        } catch (error) {
            showError('Failed to fetch corporate details');
            return null;
        }
    }
}));

export const useCorporateStore = () => store((state) => state);
