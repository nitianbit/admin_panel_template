export interface Specialist {
    _id?: string;
    name: string;
    profilePictureUrl?: string;
    rating?: number;
    specialization: string;
    degree?: string;
    experienceYears?: number;
    languages?: string[];
    bio?: string;
    consultationFee?: number;
    isConsultationFree?: boolean;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    isActive?: boolean;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SpecialistResponse {
    data: {
        rows: Specialist[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface SpecialistFilters {
    specialization?: string;
    isActive?: boolean;
    isVerified?: boolean;
    minRating?: number;
    maxRating?: number;
    minExperience?: number;
    maxExperience?: number;
    language?: string;
    search?: string;
    city?: string;
    state?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

export interface SpecialistState {
    data: Specialist[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: SpecialistFilters;
    isLoading: boolean;
    rows: number;
    allData: Specialist[];
    fetchGrid: (page?: number, filters?: SpecialistFilters) => Promise<void>;
    fetchVerified: () => Promise<Specialist[]>;
    fetchBySpecialization: (specialization: string) => Promise<Specialist[]>;
    setFilters: (newFilters: SpecialistFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<Specialist | null>;
    onUpdate: (...args: any) => Promise<Specialist | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: Specialist }>;
}
