
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

const BASE_URL = '/corporates';

const store = create<CorporateState>((set, get) => ({
    data: [],
    totalPages: 0,
    total: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    limit: 10,

    // GET /corporates
    fetchGrid: async () => {
        try {
            const { filters, currentPage, limit, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters as any);
            queryParams.append('page', String(currentPage));
            queryParams.append('limit', String(limit));

            const apiUrl = `${BASE_URL}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                const resData = response.data?.data || response.data;
                const rows = resData?.rows || resData;
                const total = resData?.total ?? (Array.isArray(rows) ? rows.length : 0);
                set({
                    data: Array.isArray(rows) ? rows : [],
                    ...(currentPage === 1 && {
                        totalPages: Math.ceil(total / limit),
                        total: total
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

    // POST /corporates
    onCreate: async (data: CreateCorporateRequest) => {
        try {
            const response = await doPOST(BASE_URL, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to create corporate');
            }
        } catch (error) {
            showError('Failed to create corporate');
        }
    },

    // PUT /corporates/:id
    onUpdate: async (id: string, data: UpdateCorporateRequest) => {
        try {
            const response = await doPUT(`${BASE_URL}/${id}`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to update corporate');
            }
        } catch (error) {
            showError('Failed to update corporate');
        }
    },

    // DELETE /corporates/:id
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(`${BASE_URL}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete corporate');
            }
        } catch (error) {
            showError('Failed to delete corporate');
        }
    },

    // GET /corporates/:id
    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE_URL}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch corporate details');
                return null;
            }
        } catch (error) {
            showError('Failed to fetch corporate details');
            return null;
        }
    },

    // GET /corporates/verified
    fetchVerified: async () => {
        try {
            const response = await doGET(`${BASE_URL}/verified`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch verified corporates');
                return [];
            }
        } catch (error) {
            showError('Failed to fetch verified corporates');
            return [];
        }
    },

    // GET /corporates/industry/:industry
    fetchByIndustry: async (industry: string) => {
        try {
            const response = await doGET(`${BASE_URL}/industry/${industry}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch corporates by industry');
                return [];
            }
        } catch (error) {
            showError('Failed to fetch corporates by industry');
            return [];
        }
    },
}));

export const useCorporateStore = () => store((state) => state);
