import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ENDPOINTS } from '../api/constants';
import { CompanyState, CompanyFilters, Company } from '../../types/company';


const store = create<CompanyState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 2,
    total:0,
    globalCompanyId : "",

    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading, total } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters);
            queryParams.append('page', String(currentPage));
            queryParams.append('rows', String(rows));
            const apiUrl = `${ENDPOINTS.grid('company')}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({
                    data: response.data.data.rows,
                    ...(currentPage == 1 && { totalPages: Math.ceil(response.data.data.total / rows) }),
                    total : response.data.data.total ? response.data.data.total : total
                });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError('Failed to fetch company');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: CompanyFilters) => {
        set({ filters: newFilters });
        get().fetchGrid(1, newFilters);
    },

    setGlobalCompanyId: (id: string) => {
        set({ globalCompanyId: id });
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
                currentPage: page+1
            })
            fetchGrid();
        }
    },

    onCreate: async (data: any) => {
        try {
            const response = await doPOST(ENDPOINTS.create('company'), data);
            console.log(response);
            if(response.status>=200 && response.status<400){
                get().fetchGrid();
            }
        } catch (error) {
            showError('Failed to create company');
        }
    },
    onUpdate: async ( data: Company) => {
        try {
            const response = await doPUT(ENDPOINTS.update('company'), data);
            console.log(response);
            if(response.status>=200 && response.status<400){
                get().fetchGrid();
            }
        } catch (error) {
            showError('Failed to update company');
        }
    },
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete('company', id));
            console.log(response);
            if(response.status>=200 && response.status<400){
                get().fetchGrid();
            }
        } catch (error) {
            showError('Failed to delete company');
        }
    },
    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail('company', id));
            return response.data;
        } catch (error) {

        }
    }
}));


export const useCompanyStore = () => store((state) => state);

