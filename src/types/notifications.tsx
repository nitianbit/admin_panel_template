

export interface Notification {
    _id?: string
    user_id?: string,
    company_id?: string,
    users?: string[],
    payload?: any,
    notification: {
        title: string,
        body: string
    },
    scheduledTime: number,//timestamp
    status: string // { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
}

export interface NotificationResponse {
    data: {
        rows: Notification[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface NotificationFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface NotificationState {
    data: Notification[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: NotificationFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: NotificationFilters) => Promise<void>;
    setFilters: (newFilters: NotificationFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<Notification | null>;
    onUpdate: (...args: any) => Promise<Notification | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: Notification }>;
}