

export interface Appointment {
    id: number;
    patient?: string;
    doctor?: string;
    hospital?: string;
    department?: string;
    appointmentDate: Date;
    timeSlot: {
        start: Date;
        end: Date;
    };
    status: string;
    fee?: Number
    paymentStatus?: string;
}

export interface AppointmentResponse {
    data: {
        rows: Appointment[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface AppointmentFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface AppointmentState {
    data: Appointment[];
    totalPages: number;
    currentPage: number;
    filters: AppointmentFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: AppointmentFilters) => Promise<void>;
    setFilters: (newFilters: AppointmentFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    create: (...args: any) => Promise<void>;
    update: (...args: any) => Promise<void>;
    delete: (...args: any) => Promise<void>;
}