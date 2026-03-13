export type BookingType = 'package' | 'consultation';
export type ServiceMode = 'in-person' | 'pickup' | 'chat' | 'call';
export type ConsultationMode = 'chat' | 'call' | 'in-person';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IDocument {
    type: 'report' | 'prescription' | 'other';
    url: string;
    fileName?: string;
}

export interface IServiceAddress {
    addressLine: string;
    city: string;
    pincode: string;
    state?: string;
}

export interface IBooking {
    _id?: string;
    bookingType: BookingType;
    userId: string; // User making the booking
    dependentId?: string; // If booking is for a dependent
    corporateId?: string; // Corporate ID if booking is through corporate
    slotId: string; // Slot ID for the booking

    // Wellness Package Booking fields
    wellnessPackageId?: string;

    // Specialist Booking fields
    specialistId?: string;
    primaryConcern?: string;
    consultationMode?: ConsultationMode;

    // Common fields
    bookingDate: string; // YYYYMMDD format (e.g., "20250215")
    bookingTime: string; // e.g., "9:00 AM"
    serviceMode: ServiceMode;
    serviceAddress?: IServiceAddress;
    documents?: IDocument[];

    // Contact information
    contactNo?: string; // Primary contact number (10 digits)
    alternateContactNo?: string; // Alternate contact number (10 digits)

    // Pricing
    price: number;
    originalPrice?: number; // For wellness packages
    couponCode?: string; // Coupon code used for this booking (if any)

    // Status
    status: BookingStatus;
    paymentStatus: PaymentStatus;

    // Additional fields
    notes?: string;
    cancellationReason?: string;
    cancelledAt?: string; // YYYYMMDD format

    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateWellnessPackageBookingRequest {
    userId: string;
    dependentId?: string;
    corporateId?: string; // Corporate ID if booking is through corporate
    wellnessPackageId: string;
    slotId: string; // Slot ID for the booking
    bookingDate: string; // YYYYMMDD format
    bookingTime: string;
    serviceMode: ServiceMode;
    serviceAddress?: IServiceAddress;
    documents?: IDocument[];
    contactNo?: string; // Primary contact number (10 digits)
    alternateContactNo?: string; // Alternate contact number (10 digits)
    couponCode?: string; // Coupon code used for this booking (if any)
    notes?: string;
}

export interface CreateSpecialistBookingRequest {
    userId: string;
    dependentId?: string;
    corporateId?: string; // Corporate ID if booking is through corporate
    specialistId: string;
    slotId: string; // Slot ID for the booking
    primaryConcern: string;
    consultationMode: ConsultationMode;
    bookingDate: string; // YYYYMMDD format
    bookingTime: string;
    serviceAddress?: IServiceAddress;
    documents?: IDocument[];
    contactNo?: string; // Primary contact number (10 digits)
    alternateContactNo?: string; // Alternate contact number (10 digits)
    couponCode?: string; // Coupon code used for this booking (if any)
    notes?: string;
}

export interface UpdateBookingRequest {
    corporateId?: string; // Corporate ID if booking is through corporate
    bookingDate?: string; // YYYYMMDD format
    bookingTime?: string;
    serviceMode?: ServiceMode;
    serviceAddress?: IServiceAddress;
    documents?: IDocument[];
    primaryConcern?: string;
    consultationMode?: ConsultationMode;
    contactNo?: string; // Primary contact number (10 digits)
    alternateContactNo?: string; // Alternate contact number (10 digits)
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    notes?: string;
    cancellationReason?: string;
    cancelledAt?: string; // YYYYMMDD format
}

export interface BookingQueryParams {
    userId?: string;
    dependentId?: string;
    corporateId?: string; // Filter by corporate ID
    bookingType?: BookingType;
    wellnessPackageId?: string;
    specialistId?: string;
    status?: BookingStatus;
    paymentStatus?: PaymentStatus;
    bookingDate?: string; // exact match
    bookingTime?: string; // exact match
    bookingDateFrom?: string; // YYYYMMDD format
    bookingDateTo?: string; // YYYYMMDD format
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any; // Allow arbitrary keys
}

export interface BookingState {
    data: IBooking[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: BookingQueryParams;
    isLoading: boolean;
    limit: number;
    fetchGrid: () => Promise<void>;
    setFilters: (newFilters: BookingQueryParams) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreateSpecialist: (data: CreateSpecialistBookingRequest) => Promise<void>;
    onCreateWellnessPackage: (data: CreateWellnessPackageBookingRequest) => Promise<void>;
    onUpdate: (id: string, data: UpdateBookingRequest) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    detail: (id: string) => Promise<{ data: IBooking } | null>;
    fetchByUserId: (userId: string) => Promise<IBooking[] | any>;
    fetchUpcoming: () => Promise<IBooking[] | any>;
}
