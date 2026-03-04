
export type DiscountType = 'percentage' | 'fixed';

export type ApplicableTo = 'all' | 'wellnessPackage' | 'consultation' | 'specific';

export interface ICoupon {
    _id?: string;
    code: string; // Unique coupon code (e.g., "WELCOME10", "SUMMER50")
    title?: string; // Display title for the coupon
    description?: string; // Description of the coupon offer
    corporateId?: string; // Corporate ID if coupon is specific to a corporate
    discountType: DiscountType; // 'percentage' or 'fixed'
    discountValue: number; // Discount percentage (e.g., 10) or fixed amount (e.g., 500)
    minimumPurchaseAmount?: number; // Minimum purchase amount required to use this coupon
    maximumDiscountAmount?: number; // Maximum discount amount (for percentage discounts, e.g., max ₹1000 off)
    applicableTo: ApplicableTo; // 'all', 'wellnessPackage', 'consultation', or 'specific'
    applicableIds?: string[]; // Array of IDs (packageIds or specialistIds) if applicableTo is 'specific'
    startDate: string; // YYYYMMDD format - Coupon validity start date
    endDate: string; // YYYYMMDD format - Coupon validity end date
    usageLimitPerUser?: number; // Maximum times a single user can use this coupon (null = unlimited)
    totalUsageLimit?: number; // Maximum total times this coupon can be used (null = unlimited)
    currentUsageCount: number; // Current number of times this coupon has been used
    isActive: boolean; // Whether coupon is currently active
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateCouponRequest {
    code: string;
    title?: string;
    description?: string;
    corporateId?: string; // Corporate ID if coupon is specific to a corporate
    discountType: DiscountType;
    discountValue: number;
    minimumPurchaseAmount?: number;
    maximumDiscountAmount?: number;
    applicableTo: ApplicableTo;
    applicableIds?: string[]; // Array of IDs if applicableTo is 'specific'
    startDate: string; // YYYYMMDD format
    endDate: string; // YYYYMMDD format
    usageLimitPerUser?: number;
    totalUsageLimit?: number;
    isActive?: boolean;
}

export interface UpdateCouponRequest {
    title?: string;
    description?: string;
    corporateId?: string; // Corporate ID if coupon is specific to a corporate
    discountType?: DiscountType;
    discountValue?: number;
    minimumPurchaseAmount?: number;
    maximumDiscountAmount?: number;
    applicableTo?: ApplicableTo;
    applicableIds?: string[];
    startDate?: string; // YYYYMMDD format
    endDate?: string; // YYYYMMDD format
    usageLimitPerUser?: number;
    totalUsageLimit?: number;
    isActive?: boolean;
}

export interface ValidateCouponRequest {
    code: string;
    userId: string; // User trying to use the coupon
    bookingType: 'package' | 'consultation'; // Type of booking
    bookingId?: string; // ID of wellness package or specialist
    purchaseAmount: number; // Total purchase amount
}

export interface CouponQueryParams {
    code?: string;
    corporateId?: string; // Filter by corporate ID
    discountType?: DiscountType;
    applicableTo?: ApplicableTo;
    isActive?: boolean;
    startDateFrom?: string; // YYYYMMDD format
    startDateTo?: string; // YYYYMMDD format
    endDateFrom?: string; // YYYYMMDD format
    endDateTo?: string; // YYYYMMDD format
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CouponState {
    data: ICoupon[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: CouponQueryParams;
    isLoading: boolean;
    limit: number;
    fetchGrid: () => Promise<void>;
    setFilters: (newFilters: CouponQueryParams) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (data: CreateCouponRequest) => Promise<void>;
    onUpdate: (data: ICoupon) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    detail: (id: string) => Promise<ICoupon | null>;
    fetchActive: () => Promise<ICoupon[]>;
    fetchApplicable: (bookingType: string) => Promise<ICoupon[]>;
    validateCoupon: (data: ValidateCouponRequest) => Promise<any>;
    fetchByCode: (code: string) => Promise<{ data: ICoupon } | null>;
}
