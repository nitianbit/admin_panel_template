import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ISlot, CreateSlotRequest, SlotQueryParams, SlotState } from '../../types/slots';

const BASE = '/slots';

const store = create<SlotState>((set, get) => ({
    data: [],
    totalPages: 0,
    total: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    limit: 10,

    // GET /slots
    fetchGrid: async () => {
        try {
            const { filters, currentPage, limit, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams();
            if (filters.specialistId) queryParams.append('specialistId', filters.specialistId);
            if (filters.wellnessPackageId) queryParams.append('wellnessPackageId', filters.wellnessPackageId);
            if (filters.slotType) queryParams.append('slotType', filters.slotType);
            if (filters.date) queryParams.append('date', filters.date);
            if (filters.isAvailable !== undefined) queryParams.append('isAvailable', String(filters.isAvailable));
            if (filters.isActive !== undefined) queryParams.append('isActive', String(filters.isActive));
            queryParams.append('page', String(currentPage));
            queryParams.append('limit', String(limit));

            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

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
            showError('Failed to fetch slots');
        } finally {
            set({ isLoading: false });
        }
    },

    // GET /slots/available
    fetchAvailable: async () => {
        try {
            const response = await doGET(`${BASE}/available`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data ?? [];
            } else {
                showError(response.message);
                return [];
            }
        } catch (err) {
            showError('Failed to fetch available slots');
            return [];
        }
    },

    // GET /slots/specialist/:specialistId
    fetchBySpecialist: async (specialistId: string) => {
        try {
            const response = await doGET(`${BASE}/specialist/${specialistId}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data ?? [];
            } else {
                showError(response.message);
                return [];
            }
        } catch (err) {
            showError('Failed to fetch slots by specialist');
            return [];
        }
    },

    // GET /slots/wellness-package/:wellnessPackageId
    fetchByWellnessPackage: async (wellnessPackageId: string) => {
        try {
            const response = await doGET(`${BASE}/wellness-package/${wellnessPackageId}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data ?? [];
            } else {
                showError(response.message);
                return [];
            }
        } catch (err) {
            showError('Failed to fetch slots by wellness package');
            return [];
        }
    },

    setFilters: (newFilters: SlotQueryParams) => {
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
        const { totalPages, fetchGrid } = get();
        const newPage = page + 1;
        if (newPage >= 1 && newPage <= totalPages) {
            set({ currentPage: newPage });
            fetchGrid();
        }
    },

    // POST /slots
    onCreate: async (data: CreateSlotRequest) => {
        try {
            const response = await doPOST(BASE, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to create slot');
            }
        } catch (error) {
            showError('Failed to create slot');
        }
    },

    // PUT /slots/:id
    onUpdate: async (data: ISlot) => {
        try {
            const id = data._id;
            if (!id) {
                showError('Slot ID is required for update');
                return;
            }
            const response = await doPUT(`${BASE}/${id}`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to update slot');
            }
        } catch (error) {
            showError('Failed to update slot');
        }
    },

    // DELETE /slots/:id
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(`${BASE}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete slot');
            }
        } catch (error) {
            showError('Failed to delete slot');
        }
    },

    // GET /slots/:id
    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE}/${id}`);
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

