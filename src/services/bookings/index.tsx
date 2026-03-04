
import { create } from 'zustand';
import { doDELETE, doGET, doPOST, doPUT } from '../../utils/HttpUtils';
import { showError } from '../toaster';
import {
    IBooking,
    CreateWellnessPackageBookingRequest,
    CreateSpecialistBookingRequest,
    BookingQueryParams,
    BookingState,
    UpdateBookingRequest
} from '../../types/bookings';

const BASE_URL = '/bookings';

const store = create<BookingState>((set, get) => ({
    data: [],
    totalPages: 0,
    total: 0,
    currentPage: 1,
    filters: {},
    isLoading: false,
    limit: 10,

    // GET /bookings
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
            showError('Failed to fetch bookings');
        } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters: BookingQueryParams) => {
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

    // POST /bookings/specialist - Create Specialist Booking
    onCreateSpecialist: async (data: CreateSpecialistBookingRequest) => {
        try {
            const response = await doPOST(`${BASE_URL}/specialist`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to create specialist booking');
            }
        } catch (error) {
            showError('Failed to create specialist booking');
        }
    },

    // POST /bookings/wellness-package - Create Wellness Package Booking
    onCreateWellnessPackage: async (data: CreateWellnessPackageBookingRequest) => {
        try {
            const response = await doPOST(`${BASE_URL}/wellness-package`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to create wellness package booking');
            }
        } catch (error) {
            showError('Failed to create wellness package booking');
        }
    },

    // PUT /bookings/:id - Update Booking
    onUpdate: async (id: string, data: UpdateBookingRequest) => {
        try {
            const response = await doPUT(`${BASE_URL}/${id}`, data);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to update booking');
            }
        } catch (error) {
            showError('Failed to update booking');
        }
    },

    // DELETE /bookings/:id
    onDelete: async (id: string) => {
        try {
            const response = await doDELETE(`${BASE_URL}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                get().fetchGrid();
            } else {
                showError(response.message || 'Failed to delete booking');
            }
        } catch (error) {
            showError('Failed to delete booking');
        }
    },

    // GET /bookings/:id - Get Booking by ID
    detail: async (id: string) => {
        try {
            const response = await doGET(`${BASE_URL}/${id}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch booking details');
                return null;
            }
        } catch (error) {
            showError('Failed to fetch booking details');
            return null;
        }
    },

    // GET /bookings/user/:userId - Get Bookings by User ID
    fetchByUserId: async (userId: string) => {
        try {
            const response = await doGET(`${BASE_URL}/user/${userId}`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch bookings by user');
                return [];
            }
        } catch (error) {
            showError('Failed to fetch bookings by user');
            return [];
        }
    },

    // GET /bookings/upcoming - Get Upcoming Bookings
    fetchUpcoming: async () => {
        try {
            const response = await doGET(`${BASE_URL}/upcoming`);
            if (response.status >= 200 && response.status < 400) {
                return response.data?.data || response.data;
            } else {
                showError(response.message || 'Failed to fetch upcoming bookings');
                return [];
            }
        } catch (error) {
            showError('Failed to fetch upcoming bookings');
            return [];
        }
    },
}));

export const useBookingStore = () => store((state) => state);
