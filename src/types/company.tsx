

export interface Company {
    name: string;
    website: string,
    logo?: string,
    isActive: boolean
}

export interface CompanyResponse {
    data: {
        rows: Company[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface CompanyFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface CompanyState {
    data: Company[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: CompanyFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: CompanyFilters) => Promise<void>;
    setFilters: (newFilters: CompanyFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<void>;
    onUpdate: (...args: any) => Promise<void>;
    onDelete: (...args: any) => Promise<void>;
}