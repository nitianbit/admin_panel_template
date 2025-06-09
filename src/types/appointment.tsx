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
    status: number;
    fee?: Number
    paymentStatus?: number;
    company?: string;
    _id?: string,
    package?: string,

    vendor?: string, //for third party
    stm_id?:string, //for report and third party
    packages?: string[],
    location: {
            latitude?: Number ,
            longitude?: Number,
        },
    address?:string,
    city?:string,
    zipcode?:string,
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
    detail: (id: string) => Promise<{ data: Appointment }>;
}

export interface ExternalSlot {
    slot_date: string;
    slot_time: string;//start time
    end_time: string;
    stm_id: string //_id
}