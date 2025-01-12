

export interface Service {
    _id?: string;
    name: string;
    type: string;
    department: string;

}

export interface ServiceResponse {
    data: {
        rows: Service[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface ServiceFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface ServiceState {
    data: Service[];
    allData: Service[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: ServiceFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: ServiceFilters) => Promise<void>;
    fetchGridAll: ( filters: ServiceFilters) => Promise<Service[]>;
    setFilters: (newFilters:ServiceFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<void>;
    onUpdate: (...args: any) => Promise<void>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: Service }>;
}