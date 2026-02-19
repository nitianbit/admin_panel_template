export interface PartnerData {
    _id?: string;
    name: string;
    logoUrl?: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    partnerType?: string; // e.g., "hospital", "lab", "clinic", "pharmacy"
    isActive?: boolean;
    isVerified?: boolean;
    order?: number; // For display ordering
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PartnerResponse {
    data: {
        rows: PartnerData[];
        totalPages: number;
        total: number;
    };
    status: number;
    message: string;
}

export interface PartnerFilters {
    partnerType?: string;
    isActive?: boolean;
    isVerified?: boolean;
    city?: string;
    state?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

export interface PartnerState {
    data: PartnerData[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: PartnerFilters;
    isLoading: boolean;
    rows: number;
    allData: PartnerData[];

    fetchGrid: (page?: number, filters?: PartnerFilters) => Promise<void>;
    setFilters: (newFilters: PartnerFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement> | null,
        page: number
    ) => void;
    onCreate: (data: PartnerData) => Promise<PartnerData | null>;
    onUpdate: (data: PartnerData) => Promise<PartnerData | null>;
    onDelete: (id: string) => Promise<void>;
    detail: (id: string) => Promise<{ data: PartnerData }>;
}
