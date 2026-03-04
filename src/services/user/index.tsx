import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError, showSuccess } from '../toaster';
import { UserData, UserFilters, UserState } from '../../types/user';

const BASE = '/users';

const store = create<UserState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 10,
    total: 0,
    allData: [],

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
                const users = resData?.users ?? resData ?? [];
                const totalCount = pagination?.total ?? resData?.total ?? (Array.isArray(users) ? users.length : 0);
                const totalPagesCount = pagination?.totalPages ?? resData?.totalPages ?? Math.ceil(totalCount / rows);
                set({
                    data: Array.isArray(users) ? users : [],
                    totalPages: totalPagesCount,
                    total: totalCount,
                });
            } else {
                showError(response.message || 'Failed to fetch users');
            }
        } catch (err) {
            showError('Failed to fetch users');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: UserFilters) => {
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
        const { totalPages } = get();
        const newPage = page + 1;
        if (newPage >= 1 && newPage <= totalPages) {
            set({ currentPage: newPage });
            get().fetchGrid();
        }
    },

    onCreate: async (data: UserData) => {
        try {
            const response = await doPOST(BASE, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
                showSuccess("User created successfully");
                return response?.data?.data;
            } else {
                showError(response.message || 'Failed to create user');
            }
            return null;
        } catch (error) {
            showError('Error creating user');
            return null;
        }
    },

    onUpdate: async (data: UserData) => {
        try {
            const id = data._id;
            if (!id) {
                showError('User ID is required for update');
                return null;
            }
            const response = await doPUT(`${BASE}/${id}`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
                showSuccess("User updated successfully");
                return response?.data?.data;
            } else {
                showError(response.message || 'Failed to update user');
            }
            return null;
        } catch (error) {
            showError('Error updating user');
            return null;
        }
    },

    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(`${BASE}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
                showSuccess("User deleted successfully");
            } else {
                showError(response.message || 'Failed to delete user');
            }
        } catch (error) {
            showError('Error deleting user');
        }
    },

    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE}/${id}`);
            return response.data;
        } catch (error) {
            showError('Failed to fetch user details');
            throw error;
        }
    }
}));

export const useUserStore = () => store((state) => state);

