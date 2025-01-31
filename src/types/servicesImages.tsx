

export interface ServicesImages {
    _id?: string;
    company: string;
    description?: string;
    image: string | null;
    name: string;
    expireAt: number | null;
    active:boolean
}

export interface ServicesImagesResponse {
    data: {
        rows: ServicesImages[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface ServicesImagesFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface ServicesImagesState {
    data: ServicesImages[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: ServicesImagesFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: ServicesImagesFilters) => Promise<void>;
    setFilters: (newFilters: ServicesImagesFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<ServicesImages | null>;
    onUpdate: (...args: any) => Promise<ServicesImages | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: ServicesImages }>;
}