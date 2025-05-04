export interface Vendor {
    _id?: string;
    name: string;
    description?: string;
    company?: string[] | null;
    external:boolean
}

export interface VendorFilters {
    [key: string]: any;
}

export interface VendorState {
    data: Vendor[];
    totalPages: number;
    currentPage: number;
    filters: VendorFilters;
    isLoading: boolean;
    rows: number;
    total: number;
    allData: Vendor[];
    fetchGrid: () => void;
    fetchGridAll: (filters: VendorFilters) => Promise<Vendor[]>;
    setFilters: (filters: VendorFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (e: any, page: number) => void;
    onCreate: (data: Vendor) => Promise<Vendor | null>;
    onUpdate: (data: Vendor) => Promise<Vendor | null>;
    onDelete: (id: string) => void;
    detail: (id: string) => Promise<any>;
}
