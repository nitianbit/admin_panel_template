import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ENDPOINTS } from '../api/constants';
import { SecondOpinionState } from '../../types/secondOpinion';

const store = create<SecondOpinionState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 20,
    total: 0,

    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters as any);
            queryParams.append("page", String(currentPage));
            queryParams.append("rows", String(rows));

            const apiUrl = `${ENDPOINTS.grid("second-opinion")}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({
                    data: response.data.data.rows,
                    ...(currentPage === 1 && {
                        totalPages: Math.ceil(response.data.data.total / rows),
                        total: response.data.data.total ?? 0,
                    }),
                });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError("Failed to fetch Second Opinion records");
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: any) => {
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

    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        const { totalPages } = get();
        if (page + 1 <= totalPages) {
            set({ currentPage: page + 1 });
            get().fetchGrid();
        }
    },

    onCreate: async (data: any) => {
        try {
            const response = await doPOST(ENDPOINTS.create("second-opinion"), data);

            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
        } catch {
            showError("Failed to create second opinion record");
        }
    },

    onUpdate: async (data: any) => {
        try {
            const response = await doPUT(ENDPOINTS.update("second-opinion"), data);

            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }

            return response;
        } catch {
            showError("Failed to update second opinion record");
        }
    },

    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete("second-opinion", id));

            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
        } catch {
            showError("Failed to delete second opinion record");
        }
    },

    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail("second-opinion", id));
            return response.data;
        } catch {
            showError("Failed to fetch second opinion details");
        }
    },
}));

export const useSecondOpinionStore = () => store((state) => state);
