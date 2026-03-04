export interface SecondOpinion {
    _id?: string;
    full_name: string;
    email: string;
    concern: string;
    medical_record?: string[]; // files array
}

export interface SecondOpinionResponse {
    data: {
        rows: SecondOpinion[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface SecondOpinionFilters {
    [key: string]: any;
}

export interface SecondOpinionState {
    data: SecondOpinion[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: SecondOpinionFilters;
    isLoading: boolean;
    rows: number;

    fetchGrid: (page?: number, filters?: SecondOpinionFilters) => Promise<void>;
    setFilters: (newFilters: SecondOpinionFilters) => void;
    nextPage: () => void;
    prevPage: () => void;

    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement> | null,
        page: number
    ) => void;

    onCreate: (...args: any) => Promise<void>;
    onUpdate: (...args: any) => Promise<void>;
    onDelete: (...args: any) => Promise<void>;

    detail: (id: string) => Promise<any>;
}
