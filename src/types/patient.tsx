

export interface Patient {
  name: string;
  gender: string;
  phone: string;
  email: string;
  company?: string
}

export interface PatientResponse {
  data: {
    rows: Patient[];
    totalPages: number;
  };
  status: number;
  message: string;
}

export interface PatientFilters {
  // Add filter properties here
  [key: string]: any;
}

export interface PatientState {
  data: Patient[];
  totalPages: number;
  currentPage: number;
  filters: PatientFilters;
  isLoading: boolean;
  rows: number;
  fetchGrid: (page?: number, filters?: PatientFilters) => Promise<void>;
  setFilters: (newFilters: PatientFilters) => void;
  nextPage: () => void;
  prevPage: () => void;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  create: (...args: any) => Promise<void>;
  update: (...args: any) => Promise<void>;
  delete: (...args: any) => Promise<void>;
}