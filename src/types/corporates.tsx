export interface ICorporate {
    _id?: string;
    name: string;
    companyName?: string;
    email?: string;
    phone?: string;
    contactPerson?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    logoUrl?: string;
    website?: string;
    domain?: string;
    industry?: string;
    employeeCount?: number;
    description?: string;
    isActive?: boolean;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateCorporateRequest {
    name: string;
    companyName?: string;
    email?: string;
    phone?: string;
    contactPerson?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    logoUrl?: string;
    website?: string;
    domain?: string;
    industry?: string;
    employeeCount?: number;
    description?: string;
    isActive?: boolean;
    isVerified?: boolean;
}

export interface UpdateCorporateRequest {
    name?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    contactPerson?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    logoUrl?: string;
    website?: string;
    domain?: string;
    industry?: string;
    employeeCount?: number;
    description?: string;
    isActive?: boolean;
    isVerified?: boolean;
}

export interface CorporateQueryParams {
    industry?: string;
    city?: string;
    state?: string;
    country?: string;
    isActive?: boolean;
    isVerified?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CorporateState {
    data: ICorporate[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: CorporateQueryParams;
    isLoading: boolean;
    limit: number;
    fetchGrid: () => Promise<void>;
    setFilters: (newFilters: CorporateQueryParams) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (data: CreateCorporateRequest) => Promise<void>;
    onUpdate: (id: string, data: UpdateCorporateRequest) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    detail: (id: string) => Promise<{ data: ICorporate } | null>;
}
