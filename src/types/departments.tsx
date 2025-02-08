

export interface Department {
    _id?: string;
    name: string;
    description?: string;
    hospital?: string;
    image?: string;

}

export interface DepartmentResponse {
    data: {
        rows: Department[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface DepartmentFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface DepartmentState {
    data: Department[];
    allData: Department[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: DepartmentFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: DepartmentFilters) => Promise<void>;
    setFilters: (newFilters: DepartmentFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<Department | null>;
    onUpdate: (...args: any) => Promise<Department | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: Department }>;
    fetchGridAll: ( filters: DepartmentFilters) => Promise<Department[]>;
}