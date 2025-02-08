import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ENDPOINTS } from '../api/constants';
import { DepartmentState, Department, DepartmentFilters } from '../../types/departments';




const store = create<DepartmentState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 20,
    total: 0,
    allData: [],

    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading, total } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters);
            queryParams.append('page', String(currentPage));
            queryParams.append('rows', String(rows));
            const apiUrl = `${ENDPOINTS.grid('departments')}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({
                    data: response.data.data.rows,
                    ...(currentPage == 1 && { totalPages: Math.ceil(response.data.data.total / rows), total: response.data.data.total ?? 0 }),
                });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError('Failed to fetch Departments');
        } finally {
            set({ isLoading: false });
        }
    },

    fetchGridAll: async (filters: DepartmentFilters) => {
        try {
            const { allData } = get();
            if (allData.length > 0) return allData;
            const queryParams = new URLSearchParams(filters);
            queryParams.append('rows', String(-1));
            const apiUrl = `${ENDPOINTS.grid('departments')}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({ allData: response.data.data.rows, });
            }
            return get().allData;
        } catch (err) {
            showError('Failed to fetch Departments');
            return get().allData
        }
    },

    setFilters: (newFilters: DepartmentFilters) => {
        set({ filters: newFilters, currentPage: 1 });
        get().fetchGrid(1, newFilters);
    },

    nextPage: () => {
        const { currentPage, totalPages, fetchGrid } = get();
        if (currentPage < totalPages) {
            set(state => ({
                currentPage: state.currentPage + 1
            }))
            fetchGrid();
        }
    },

    prevPage: () => {
        const { currentPage, filters, fetchGrid } = get();
        if (currentPage > 1) {
            set(state => ({
                currentPage: state.currentPage - 1
            }))
            fetchGrid();
        }
    },
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        const { currentPage, filters, fetchGrid, totalPages } = get();
        if (currentPage > 1 || currentPage <= totalPages) {
            set({
                currentPage: page + 1
            })
            fetchGrid();
        }
    },

    onCreate: async (data: any) => {
        try {
            const response = await doPOST(ENDPOINTS.create('departments'), data);
            console.log(response);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
            return response?.data?.data
        } catch (error) {
            return null;
        }
    },
    onUpdate: async (data: Department) => {
        try {
            const response = await doPUT(ENDPOINTS.update('departments'), data);
            console.log(response);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
            return response?.data?.data
        } catch (error) {
            return null;
        }
    },
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete('departments', id));
            console.log(response);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            }
        } catch (error) {

        }
    },
    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail('departments', id));
            return response.data;
        } catch (error) {

        }
    }

}));



export const useDepartmentStore = () => store((state) => state);
