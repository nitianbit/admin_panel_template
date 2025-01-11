export interface Report {
    doctor?: string; // Reference to Doctor ID
    lab?: string; // Reference to Lab ID
    type: 1 | 2; // 1: Report, 2: Prescription
    notes?: string; // Additional notes
    date: number; // Timestamp for the report or prescription date
    patient: string; // Reference to Patient ID
    attachments:string[]
}

export interface ReportResponse {
    data: {
        rows: Report[]; // Array of report records
        totalPages: number; // Total number of pages for pagination
    };
    status: number; // Response status code
    message: string; // Response message
}

export interface ReportFilters {
    // Filters for querying reports
    type?: 1 | 2; // Filter by type (Report or Prescription)
    doctor?: string; // Filter by doctor ID
    lab?: string; // Filter by lab ID
    dateFrom?: number; // Start date for filtering
    dateTo?: number; // End date for filtering
    [key: string]: any; // Additional filters
}

export interface ReportState {
    data: Report[]; // Array of reports
    totalPages: number; // Total pages for pagination
    total: number; // Total number of records
    currentPage: number; // Current page number
    filters: ReportFilters; // Active filters
    isLoading: boolean; // Loading state
    rows: number; // Number of rows per page
    fetchGrid: (page?: number, filters?: ReportFilters) => Promise<void>; // Fetch reports with optional filters
    setFilters: (newFilters: ReportFilters) => void; // Update filters
    nextPage: () => void; // Go to the next page
    prevPage: () => void; // Go to the previous page
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void; // Handle page changes
    onCreate: (report: Report) => Promise<void>; // Create a new report
    onUpdate: ( updatedReport: Partial<Report>) => Promise<Report>; // Update an existing report
    onDelete: (id: string) => Promise<void>; // Delete a report
    detail: (id: string) => Promise<{ data: Report }>; // Fetch details of a specific report
}
