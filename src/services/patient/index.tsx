import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { PatientFilters, PatientState } from '../../types/patient';
import { ENDPOINTS } from '../api/constants';


const store = create<PatientState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 20,

    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters);
            queryParams.append('page', String(currentPage));
            queryParams.append('rows', String(rows));
            const apiUrl = `${ENDPOINTS.grid('patients')}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                set({
                    data: response.data.data.rows,
                    ...(currentPage == 1 && { totalPages: Math.ceil(response.data.data.total / rows) })
                });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError('Failed to fetch doctors');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: PatientFilters) => {
        set({ filters: newFilters });
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
        if (currentPage > 1 || currentPage < totalPages) {
            set({
                currentPage: page
            })
            fetchGrid();
        }
    },

    create: async (data: any) => {
        try {
            const response = await doPOST(ENDPOINTS.create('patients'), data);
            console.log(response);
        } catch (error) {

        }
    },
    update: async (id: string, data: any) => {
        try {
            const response = await doPUT(ENDPOINTS.update('patients', id), data);
            console.log(response);
        } catch (error) {

        }
    },
    delete: async (id: string) => {
        try {
            const response = await doDELETE(ENDPOINTS.delete('patients', id));
            console.log(response);
        } catch (error) {

        }
    }
}));


export const usePatientStore = () => store((state) => state);
