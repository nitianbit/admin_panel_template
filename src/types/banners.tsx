export type BannerType = 'home' | 'promotional' | 'category' | 'wellnessPackage' | 'specialist' | 'surgery' | 'second-opinion';

export interface Banner {
    _id?: string;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    bannerType?: BannerType;
    startDate?: string;
    endDate?: string;
    target?: string;
    targetId?: string;
    isActive?: boolean;
    order?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface BannerResponse {
    data: {
        rows: Banner[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface BannerFilters {
    bannerType?: BannerType;
    targetId?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

export interface BannerState {
    data: Banner[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: BannerFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: BannerFilters) => Promise<void>;
    setFilters: (newFilters: BannerFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<Banner | null>;
    onUpdate: (...args: any) => Promise<Banner | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: Banner }>;
}