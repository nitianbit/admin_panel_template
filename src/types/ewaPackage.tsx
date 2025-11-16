export interface EwaPackageData {
  _id?: string;
  full_name: string;
  email: string;
  EwaPackage: string;
  message?: string; // optional as per schema
}

export interface EwaPackageResponse {
  data: {
    rows: EwaPackageData[];
    total: number;
    totalPages: number;
  };
  status: number;
  message: string;
}

export interface EwaPackageFilters {
  [key: string]: any;
}

export interface EwaPackageState {
  data: EwaPackageData[];
  totalPages: number;
  total: number;
  currentPage: number;
  filters: EwaPackageFilters;
  isLoading: boolean;
  rows: number;

  fetchGrid: (page?: number, filters?: EwaPackageFilters) => Promise<void>;
  setFilters: (newFilters: EwaPackageFilters) => void;

  nextPage: () => void;
  prevPage: () => void;

  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    page: number
  ) => void;

  onCreate: (data: EwaPackageData) => Promise<EwaPackageData | null>;
  onUpdate: (data: EwaPackageData) => Promise<EwaPackageData | null>;
  onDelete: (id: string) => Promise<void>;
  detail: (id: string) => Promise<{ data: EwaPackageData }>;
}
