export interface TestCategory {
    categoryName: string;
    categoryTestsCount: number;
    subTests: string[];
}

export interface WellnessPackage {
    _id?: string;
    corporate_id?: string;
    name: string;
    description?: string;
    bookingProcedure?: string;
    imageUrl?: string;
    originalPrice: number;
    discountedPrice: number;
    totalTestsCount: number;
    hasFreeDoctorConsultation: boolean;
    testsIncluded: TestCategory[];
    category?: string;
    isActive?: boolean;
    isPopular?: boolean;
    order?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WellnessPackageResponse {
    data: {
        rows: WellnessPackage[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface WellnessPackageFilters {
    category?: string;
    isActive?: boolean;
    isPopular?: boolean;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    [key: string]: any;
}

export interface WellnessPackageState {
    data: WellnessPackage[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: WellnessPackageFilters;
    isLoading: boolean;
    rows: number;
    allData: WellnessPackage[];
    fetchGrid: (page?: number, filters?: WellnessPackageFilters) => Promise<void>;
    setFilters: (newFilters: WellnessPackageFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<WellnessPackage | null>;
    onUpdate: (...args: any) => Promise<WellnessPackage | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: WellnessPackage } | undefined>;
}
