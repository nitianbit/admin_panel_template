import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { Banner, BannerFilters, BannerType } from '../../types/banners';

const BANNER_ENDPOINTS = {
    base: '/banners',
    active: '/banners/active',
    byType: (type: BannerType) => `/banners/type/${type}`,
    byId: (id: string) => `/banners/${id}`,
};

interface BannerState {
    data: Banner[];
    activeBanners: Banner[];
    typeBanners: Banner[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: BannerFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: BannerFilters) => Promise<void>;
    fetchActive: () => Promise<void>;
    fetchByType: (type: BannerType) => Promise<void>;
    setFilters: (newFilters: BannerFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (data: any) => Promise<Banner | null>;
    onUpdate: (data: Banner) => Promise<Banner | null>;
    onDelete: (id: string) => Promise<void>;
    detail: (id: string) => Promise<{ data: Banner }>;
}

const store = create<BannerState>((set, get) => ({
    data: [],
    activeBanners: [],
    typeBanners: [],
    totalPages: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    rows: 10,
    total: 0,

    // GET /banners — Get all banners
    fetchGrid: async () => {
        try {
            const { filters, currentPage, rows, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters);
            queryParams.append('page', String(currentPage));
            queryParams.append('limit', String(rows));
            const apiUrl = `${BANNER_ENDPOINTS.base}?${queryParams.toString()}`;

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
            showError('Failed to fetch banners');
        } finally {
            set({ isLoading: false });
        }
    },

    // GET /banners/active — Get active banners
    fetchActive: async () => {
        try {
            const response = await doGET(BANNER_ENDPOINTS.active);
            if (response.status >= 200 && response.status < 400) {
                const resData = response.data?.data;
                set({ activeBanners: resData?.rows ?? resData ?? [] });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError('Failed to fetch active banners');
        }
    },

    // GET /banners/type/:bannerType — Get banners by type
    fetchByType: async (type: BannerType) => {
        try {
            const response = await doGET(BANNER_ENDPOINTS.byType(type));
            if (response.status >= 200 && response.status < 400) {
                const resData = response.data?.data;
                set({ typeBanners: resData?.rows ?? resData ?? [] });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError('Failed to fetch banners by type');
        }
    },

    setFilters: (newFilters: BannerFilters) => {
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
        const { currentPage, fetchGrid } = get();
        if (currentPage > 1) {
            set(state => ({
                currentPage: state.currentPage - 1
            }))
            fetchGrid();
        }
    },

    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        const { currentPage, fetchGrid, totalPages } = get();
        if (currentPage > 1 || currentPage <= totalPages) {
            set({
                currentPage: page + 1
            })
            fetchGrid();
        }
    },

    // POST /banners — Create banner
    onCreate: async (data: any) => {
        try {
            const response = await doPOST(BANNER_ENDPOINTS.base, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message);
            }
            return response?.data?.data
        } catch (error) {
            showError('Failed to create banner');
            return null
        }
    },

    // PUT /banners/:id — Update banner
    onUpdate: async (data: Banner) => {
        try {
            const id = data._id;
            if (!id) {
                showError('Banner ID is required for update');
                return null;
            }
            const response = await doPUT(BANNER_ENDPOINTS.byId(id), data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message);
            }
            return response?.data?.data
        } catch (error) {
            showError('Failed to update banner');
            return null
        }
    },

    // DELETE /banners/:id — Delete banner
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(BANNER_ENDPOINTS.byId(id));
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message);
            }
        } catch (error) {
            showError('Failed to delete banner');
        }
    },

    // GET /banners/:id — Get banner detail
    detail: async (id: string) => {
        try {
            const response = await doGET(BANNER_ENDPOINTS.byId(id));
            return response.data;
        } catch (error) {
            showError('Failed to fetch banner detail');
            return { data: {} as Banner };
        }
    }

}));



export const useBannerStore = () => store((state) => state);
