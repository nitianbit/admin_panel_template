
export interface MARKETING {
    _id?: string;
    name: string;
    email: string,
    phone?: string,
    role: string[];
    countryCode?: string,
    company: string,
}

export interface MARKETINGResponse {
    data: {
        rows: MARKETING[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface MARKETINGFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface MARKETINGState {
    data: MARKETING[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: MARKETINGFilters;
    isLoading: boolean;
    rows: number;
    globalMARKETINGId?: string;
    fetchGrid: (page?: number, filters?: MARKETINGFilters) => Promise<void>;
    setFilters: (newFilters: MARKETINGFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<void>;
    onUpdate: (...args: any) => Promise<void>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<any>;
}