export interface HealthTip {
    _id?: string;
    title: string;
    description: string;
    shortDescription?: string;
    icon?: string;
    imageUrl?: string;
    category?: string;
    isActive?: boolean;
    order?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface HealthTipResponse {
    data: {
        rows: HealthTip[];
        totalPages: number;
        total: number;
    };
    status: number;
    message: string;
}

export interface HealthTipFilters {
    category?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

export interface HealthTipState {
    data: HealthTip[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: HealthTipFilters;
    isLoading: boolean;
    rows: number;
    allData: HealthTip[];
    fetchGrid: (page?: number, filters?: HealthTipFilters) => Promise<void>;
    setFilters: (newFilters: HealthTipFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement> | null,
        page: number
    ) => void;
    onCreate: (data: HealthTip) => Promise<HealthTip | null>;
    onUpdate: (data: HealthTip) => Promise<HealthTip | null>;
    onDelete: (id: string) => Promise<void>;
    detail: (id: string) => Promise<{ data: HealthTip }>;
}
