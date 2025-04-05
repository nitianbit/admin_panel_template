import { create } from "zustand";
import { doGET, doPOST, doPUT, doDELETE } from "../../utils/HttpUtils";
import { showError } from "../toaster";
import { ENDPOINTS } from "../api/constants";
import { BlogState } from "../../types/blogs";

const store = create<BlogState>((set, get) => ({
  data: [],
  totalPages: 0,
  total: 0,
  currentPage: 1,
  filters: {},
  isLoading: false,
  rows: 10,

  fetchGrid: async () => {
    const { currentPage, filters, rows, isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams(filters);
      queryParams.append("page", String(currentPage));
      queryParams.append("limit", String(rows));

      const url = `${ENDPOINTS.grid("blogs")}?${queryParams.toString()}`;
      const response = await doGET(url);

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
    } catch (error) {
      showError("Failed to fetch blogs");
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (newFilters) => {
    set({ filters: newFilters, currentPage: 1 });
    get().fetchGrid();
  },

  nextPage: () => {
    const { currentPage, totalPages, fetchGrid } = get();
    if (currentPage < totalPages) {
      set((state) => ({
        currentPage: state.currentPage + 1,
      }));
      fetchGrid();
    }
  },

  prevPage: () => {
    const { currentPage, fetchGrid } = get();
    if (currentPage > 1) {
      set((state) => ({
        currentPage: state.currentPage - 1,
      }));
      fetchGrid();
    }
  },

  onPageChange: (_e, page) => {
    const { fetchGrid } = get();
    set({ currentPage: page + 1 });
    fetchGrid();
  },

  onCreate: async (payload) => {
    try {
      const response = await doPOST(ENDPOINTS.create("blogs"), payload);
      if (response.status >= 200 && response.status < 400) {
        get().fetchGrid();
      }
      return response?.data?.data;
    } catch (error) {
      return null;
    }
  },

  onUpdate: async (id, payload) => {
    try {
      const response = await doPUT(ENDPOINTS.update("blogs"), payload);
      if (response.status >= 200 && response.status < 400) {
        get().fetchGrid();
      }
      return response?.data?.data;
    } catch (error) {
      return null;
    }
  },

  onDelete: async (id) => {
    try {
      const response = await doDELETE(ENDPOINTS.delete("blogs", id));
      if (response.status >= 200 && response.status < 400) {
        get().fetchGrid();
      }
    } catch (error) {
      //
    }
  },

  detail: async (id) => {
    try {
      const response = await doGET(ENDPOINTS.detail("blogs", id));
      return response.data;
    } catch (error) {
      return null;
    }
  },
}));

export const useBlogStore = () => store((state) => state);
