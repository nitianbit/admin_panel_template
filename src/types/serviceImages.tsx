

export interface ServiceImage {
    _id?: string;
    image: string | null;
    name?: string;
}

export interface OfferResponse {
    data: {
        rows: ServiceImage[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface ServiceImageFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface ServiceImageState {
    data: ServiceImage[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: ServiceImageFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: ServiceImageFilters) => Promise<void>;
    setFilters: (newFilters: ServiceImageFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<ServiceImage | null>;
    onUpdate: (...args: any) => Promise<ServiceImage | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: ServiceImage }>;
}