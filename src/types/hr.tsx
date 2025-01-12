
export interface HR {
    _id?: string;
    name: string;
    email: string,
    phone?: string,
    role: string[];
    countryCode?: string,
    company: string,
}

export interface HRResponse {
    data: {
        rows: HR[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface HRFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface HRState {
    data: HR[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: HRFilters;
    isLoading: boolean;
    rows: number;
    globalHRId?: string;
    fetchGrid: (page?: number, filters?: HRFilters) => Promise<void>;
    setFilters: (newFilters: HRFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<void>;
    onUpdate: (...args: any) => Promise<void>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<any>;
}