

export interface Offer {
    _id?: string;
    company: string;
    description?: string;
    image: string | null;
    name: string;
    expireAt: number | null;
    active:boolean
}

export interface OfferResponse {
    data: {
        rows: Offer[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface OfferFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface OfferState {
    data: Offer[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: OfferFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: OfferFilters) => Promise<void>;
    setFilters: (newFilters: OfferFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<Offer | null>;
    onUpdate: (...args: any) => Promise<Offer | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: Offer }>;
}