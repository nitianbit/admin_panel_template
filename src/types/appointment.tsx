

export interface Appointment {
    patient: string;
    doctor: string;
    hospital?: string;
    department?: string;
    appointmentDate: string;
    timeSlot: {
        start: string;
        end: string;
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
    total: number;
    currentPage: number;
    filters: AppointmentFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: AppointmentFilters) => Promise<void>;
    setFilters: (newFilters: AppointmentFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<void>;
    onUpdate: (...args: any) => Promise<void>;
    onDelete: (...args: any) => Promise<void>;
}