export interface UserData {
    _id?: string;
    // Authentication & Basic Info
    email?: string;
    phone?: string;
    userType: 'user' | 'admin';
    name?: string;
    profilePictureUrl?: string;

    // User-specific fields
    dateOfBirth?: string;
    gender?: 'Male' | 'Female' | 'Other';
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    height?: number;
    weight?: number;
    emergencyContact?: {
        name?: string;
        phone?: string;
        relationship?: string;
    };

    // Address fields
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;

    // Corporate association
    corporateId?: string;

    // Admin-specific fields
    department?: string;
    employeeId?: string;
    permissions?: string[];

    // Status fields
    isActive?: boolean;
    isVerified?: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserResponse {
    data: {
        rows: UserData[];
        totalPages: number;
        total: number;
    };
    status: number;
    message: string;
}

export interface UserFilters {
    userType?: string;
    email?: string;
    phone?: string;
    corporateId?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

export interface UserState {
    data: UserData[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: UserFilters;
    isLoading: boolean;
    rows: number;
    allData: UserData[];

    fetchGrid: (page?: number, filters?: UserFilters) => Promise<void>;
    setFilters: (newFilters: UserFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement> | null,
        page: number
    ) => void;
    onCreate: (data: UserData) => Promise<UserData | null>;
    onUpdate: (data: UserData) => Promise<UserData | null>;
    onDelete: (id: string) => Promise<void>;
    detail: (id: string) => Promise<{ data: UserData }>;
}
