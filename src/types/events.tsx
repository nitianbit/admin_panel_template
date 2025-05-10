

export interface Event {
    _id?: string;
    name: string;
    description?: string;
    hospital?: string;
    image?: string;

}

export interface EventResponse {
    data: {
        rows: Event[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface EventFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface EventState {
    data: Event[];
    allData: Event[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: EventFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: EventFilters) => Promise<void>;
    setFilters: (newFilters: EventFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<Event | null>;
    onUpdate: (...args: any) => Promise<Event | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: Event }>;
    fetchGridAll: ( filters: EventFilters) => Promise<Event[]>;
}