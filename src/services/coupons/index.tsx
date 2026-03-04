
import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import { ICoupon, CreateCouponRequest, CouponQueryParams, CouponState, ValidateCouponRequest } from '../../types/coupons';

const BASE_URL = '/coupons';

const store = create<CouponState>((set, get) => ({
    data: [],
    totalPages: 0,
    total: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    limit: 10,

    // GET /coupons (with query params for pagination & filters)
    fetchGrid: async () => {
        try {
            const { filters, currentPage, limit, isLoading } = get();
            if (isLoading) return;

            set({ isLoading: true });

            const queryParams = new URLSearchParams(filters as any);
            queryParams.append('page', String(currentPage));
            queryParams.append('limit', String(limit));

            const apiUrl = `${BASE_URL}?${queryParams.toString()}`;

            const response = await doGET(apiUrl);

            if (response.status >= 200 && response.status < 400) {
                const resData = response.data?.data || response.data;
                const rows = resData?.rows || resData;
                const total = resData?.total ?? (Array.isArray(rows) ? rows.length : 0);
                set({
                    data: Array.isArray(rows) ? rows : [],
                    ...(currentPage === 1 && {
                        totalPages: Math.ceil(total / limit),
                        total: total
                    }),
                });
            } else {
                showError(response.message);
            }
        } catch (err) {
            showError('Failed to fetch coupons');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: CouponQueryParams) => {
        set({ filters: newFilters, currentPage: 1 });
        get().fetchGrid();
    },

    nextPage: () => {
        const { currentPage, totalPages, fetchGrid } = get();
        if (currentPage < totalPages) {
            set(state => ({
                currentPage: state.currentPage + 1
            }));
            fetchGrid();
        }
    },

    prevPage: () => {
        const { currentPage, fetchGrid } = get();
        if (currentPage > 1) {
            set(state => ({
                currentPage: state.currentPage - 1
            }));
            fetchGrid();
        }
    },

    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
        const { totalPages } = get();
        const newPage = page + 1;
        if (newPage >= 1 && newPage <= totalPages) {
            set({
                currentPage: newPage
            });
            get().fetchGrid();
        }
    },

    // POST /coupons
    onCreate: async (data: CreateCouponRequest) => {
        try {
            const response = await doPOST(BASE_URL, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to create coupon');
            }
        } catch (error) {
            showError('Failed to create coupon');
        }
    },

    // PUT /coupons/:id
    onUpdate: async (data: ICoupon) => {
        try {
            const id = data._id;
            const response = await doPUT(`${BASE_URL}/${id}`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to update coupon');
            }
        } catch (error) {
            showError('Failed to update coupon');
        }
    },

    // DELETE /coupons/:id
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(`${BASE_URL}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete coupon');
            }
        } catch (error) {
            showError('Failed to delete coupon');
        }
    },

    // GET /coupons/:id
    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE_URL}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch coupon details');
                return null;
            }
        } catch (error) {
            showError('Failed to fetch coupon details');
            return null;
        }
    },

    // GET /coupons/active
    fetchActive: async () => {
        try {
            const response = await doGET(`${BASE_URL}/active`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch active coupons');
                return [];
            }
        } catch (error) {
            showError('Failed to fetch active coupons');
            return [];
        }
    },

    // GET /coupons/applicable?bookingType=...
    fetchApplicable: async (bookingType: string) => {
        try {
            const response = await doGET(`${BASE_URL}/applicable?bookingType=${bookingType}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch applicable coupons');
                return [];
            }
        } catch (error) {
            showError('Failed to fetch applicable coupons');
            return [];
        }
    },

    // POST /coupons/validate
    validateCoupon: async (data: ValidateCouponRequest) => {
        try {
            const response = await doPOST(`${BASE_URL}/validate`, data);
            if (response.status >= 200 && response.status < 400) {
                return response.data;
            } else {
                showError(response.message || 'Coupon validation failed');
                return null;
            }
        } catch (error) {
            showError('Failed to validate coupon');
            return null;
        }
    },

    // GET /coupons/code/:code
    fetchByCode: async (code: string) => {
        try {
            const response = await doGET(`${BASE_URL}/code/${code}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data;
            } else {
                showError(response.message || 'Failed to fetch coupon by code');
                return null;
            }
        } catch (error) {
            showError('Failed to fetch coupon by code');
            return null;
        }
    },
}));

export const useCouponStore = () => store((state) => state);
