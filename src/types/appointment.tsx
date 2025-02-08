import { Dayjs } from "dayjs";


export interface Appointment {
    patient: string;
    doctor?: string;
    lab?: string; // Reference to Lab ID
    hospital?: string;
    department?: string;
    type: string // 1: Report, 2: Prescription
    appointmentDate: string | Dayjs;
    timeSlot: {
        start: string;
        end: string;
    };
    status: string;
    fee?: Number
    paymentStatus?: string;
    company?: string;
    _id?:string
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
    detail: (id:string) => Promise<{data:Appointment}>;
}