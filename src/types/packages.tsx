

export interface Package {
    _id?: string;
    name: string;
    description?: string;
    hospital?: string;
    image?: string;
    company:string

}

export interface PackageResponse {
    data: {
        rows: Package[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface PackageFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface PackageState {
    data: Package[];
    allData: Package[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: PackageFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: PackageFilters) => Promise<void>;
    setFilters: (newFilters: PackageFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<Package | null>;
    onUpdate: (...args: any) => Promise<Package | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: Package }>;
    fetchGridAll: ( filters: PackageFilters) => Promise<Package[]>;
}