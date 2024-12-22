

export interface Doctor {
    id: number;
    name: string;
    gender: string;
    phone: string;
    email: string;
    education: string;
    specialization: string;
 }

export interface DoctorResponse {
  data: {
    rows: Doctor[];
    totalPages: number;
  };
  status: number;
  message: string;
}

export interface DoctorFilters {
  // Add filter properties here
  [key: string]: any;
}

export interface DoctorState {
  data: Doctor[];
  totalPages: number;
  currentPage: number;
  filters: DoctorFilters;
  isLoading: boolean;
  rows:number;
  fetchGrid: (page?: number, filters?: DoctorFilters) => Promise<void>;
  setFilters: (newFilters: DoctorFilters) => void;
  nextPage: () => void;
  prevPage: () => void;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null,page:number) => void;
  onCreate: (...args:any) => Promise<void>;
  onUpdate: (...args:any) => Promise<void>;
  onDelete: (...args:any) => Promise<void>;
}