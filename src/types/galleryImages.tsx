

export interface GalleryImage {
    _id?: string;
    image: string | null;
    name?: string;
}

export interface OfferResponse {
    data: {
        rows: GalleryImage[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface GalleryImageFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface GalleryImageState {
    data: GalleryImage[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: GalleryImageFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: GalleryImageFilters) => Promise<void>;
    setFilters: (newFilters: GalleryImageFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<GalleryImage | null>;
    onUpdate: (...args: any) => Promise<GalleryImage | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: GalleryImage }>;
}