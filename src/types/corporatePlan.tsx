export interface CorporatePlanData {
  _id?: string;
  full_name: string;
  email: string;
  size: string;
  goals?: string; // optional as per schema
}

export interface CorporatePlanResponse {
  data: {
    rows: CorporatePlanData[];
    total: number;
    totalPages: number;
  };
  status: number;
  message: string;
}

export interface CorporatePlanFilters {
  [key: string]: any;
}

export interface CorporatePlanState {
  data: CorporatePlanData[];
  totalPages: number;
  total: number;
  currentPage: number;
  filters: CorporatePlanFilters;
  isLoading: boolean;
  rows: number;

  fetchGrid: (page?: number, filters?: CorporatePlanFilters) => Promise<void>;
  setFilters: (newFilters: CorporatePlanFilters) => void;
  nextPage: () => void;
  prevPage: () => void;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;

  onCreate: (data: CorporatePlanData) => Promise<CorporatePlanData | null>;
  onUpdate: (data: CorporatePlanData) => Promise<CorporatePlanData | null>;
  onDelete: (id: string) => Promise<void>;
  detail: (id: string) => Promise<{ data: CorporatePlanData }>;
}
