

export interface Wellness {
    _id?: string;
    title: string;
    description: string,
    images?: string[],
    startTime: number,
}

export interface WellnessResponse {
    data: {
        rows: Wellness[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface WellnessFilters {
     [key: string]: any;
}

export interface WellnessState {
    data: Wellness[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: WellnessFilters;
    isLoading: boolean;
    rows: number;
    globalWellnessId?:string;
    fetchGrid: (page?: number, filters?: WellnessFilters) => Promise<void>;
    setFilters: (newFilters: WellnessFilters) => void;
     nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<void>;
    onUpdate: (...args: any) => Promise<void>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id:string) => Promise<any>;
}