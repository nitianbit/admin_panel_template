import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ENDPOINTS } from '../api/constants';
import { CorporatePlanData, CorporatePlanFilters, CorporatePlanState } from '../../types/corporatePlan';

const store = create<CorporatePlanState>((set, get) => ({
  data: [],
  totalPages: 0,
  total: 0,
  currentPage: 1,
  filters: {},
  isLoading: false,
  rows: 20,

  fetchGrid: async () => {
    const { filters, currentPage, rows, isLoading } = get();
    if (isLoading) return;

    try {
      set({ isLoading: true });

      const queryParams = new URLSearchParams(filters);
      queryParams.append('page', String(currentPage));
      queryParams.append('rows', String(rows));
      const apiUrl = `${ENDPOINTS.grid('corporate-plan')}?${queryParams.toString()}`;

      const response = await doGET(apiUrl);

      if (response.status >= 200 && response.status < 400) {
        set({
          data: response.data.data.rows,
          ...(currentPage === 1 && {
            totalPages: Math.ceil(response.data.data.total / rows),
            total: response.data.data.total ?? 0
          })
        });
      } else {
        showError(response.message);
      }
    } catch (err) {
      showError('Failed to fetch CorporatePlans');
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters: CorporatePlanFilters) => {
    set({ filters: newFilters, currentPage: 1 });
    get().fetchGrid();
  },

  nextPage: () => {
    const { currentPage, totalPages } = get();
    if (currentPage < totalPages) {
      set({ currentPage: currentPage + 1 });
      get().fetchGrid();
    }
  },

  prevPage: () => {
    const { currentPage } = get();
    if (currentPage > 1) {
      set({ currentPage: currentPage - 1 });
      get().fetchGrid();
    }
  },

  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    const { currentPage, totalPages } = get();
    if (page + 1 !== currentPage && page + 1 <= totalPages) {
      set({ currentPage: page + 1 });
      get().fetchGrid();
    }
  },

  onCreate: async (data: Partial<CorporatePlanData>) => {
    try {
      const response = await doPOST(ENDPOINTS.create('corporate-plan'), data);
      if (response.status >= 200 && response.status < 400) {
        get().fetchGrid();
      }
      return response?.data?.data;
    } catch {
      return null;
    }
  },

  onUpdate: async (data: CorporatePlanData) => {
    try {
      const response = await doPUT(ENDPOINTS.update('corporate-plan'), data);
      if (response.status >= 200 && response.status < 400) {
        get().fetchGrid();
      }
      return response?.data?.data;
    } catch {
      return null;
    }
  },

  onDelete: async (id: string) => {
    try {
      const response = await doDELETE(ENDPOINTS.delete('corporate-plan', id));
      if (response.status >= 200 && response.status < 400) {
        get().fetchGrid();
      }
    } catch {
      // Optionally show error
    }
  },

  detail: async (id: string) => {
    try {
      const response = await doGET(ENDPOINTS.detail('corporate-plan', id));
      return response.data;
    } catch {
      return { data: {} as CorporatePlanData };
    }
  }
}));

export const useCorporatePlanStore = () => store((state) => state);
