import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError, showSuccess } from '../toaster';
import { ENDPOINTS } from '../api/constants';
import { ServiceState ,Service,ServiceFilters} from '../../types/services';




const store = create<ServiceState>((set, get) => ({
    data: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 20,
    total:0,

    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows,isLoading , total} = get();
            if(isLoading)return;
            
            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters);
            queryParams.append('page', String(currentPage));
            queryParams.append('rows', String(rows));
            const apiUrl = `${ENDPOINTS.grid('services')}?${queryParams.toString()}`;

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
            showError('Failed to fetch services');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: ServiceFilters) => {
        set({ filters: newFilters,currentPage:1 });
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
    onPageChange: ( event: React.MouseEvent<HTMLButtonElement> | null,page:number) => {
        const { currentPage, filters, fetchGrid,totalPages } = get();
        if (currentPage > 1 || currentPage <= totalPages) {
            set({
                currentPage: page+1
            })
            fetchGrid();
        }
    },

    onCreate:async (data:any)=>{
        try {
            const response=await doPOST(ENDPOINTS.create('services'),data);
            console.log(response);
            if(response.status>=200 && response.status<400){
                get().fetchGrid();
                showSuccess("Service create successfully")
            }else{
                showError(response.message);
            }
        } catch (error) {
            showError('Failed to create service');
        }
    },
    onUpdate:async (data:Service)=>{
        try {
            const response=await doPUT(ENDPOINTS.update('services'),data);
            console.log(response);
            if(response.status>=200 && response.status<400){
                get().fetchGrid();
                showSuccess("Service updated successfully")
            }
        } catch (error) {
            showError('Failed to update service');
        }
    },
    onDelete:async (id:string)=>{
        try {
            const response=await doDELETE(ENDPOINTS.delete('services',id));
            console.log(response);
            if(response.status>=200 && response.status<400){
                get().fetchGrid();
                showSuccess("Service deleted successfully")
            }
        } catch (error) {
            showError('Failed to delete service');
        }
    },
    detail: async (id: string) => {
        try {
            const response = await doGET(ENDPOINTS.detail('services', id));
            return response.data;
        } catch (error) {

        }
    }

}));

 

export const useServicestore = () => store((state) => state);
