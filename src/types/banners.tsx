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
        total: number;
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