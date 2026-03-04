export interface Surgery {
    _id?: string;
    full_name: string;
    email: string;
    concern: string;
    speciality: string;
    medical_record?: string[];
}

export interface SurgeryResponse {
    data: {
        rows: Surgery[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface SurgeryFilters {
    [key: string]: any;
}

export interface SurgeryState {
    data: Surgery[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: SurgeryFilters;
    isLoading: boolean;
    rows: number;
    globalWellnessId?: string;   // **kept same as requested**
    fetchGrid: (page?: number, filters?: SurgeryFilters) => Promise<void>;
    setFilters: (newFilters: SurgeryFilters) => void;
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
