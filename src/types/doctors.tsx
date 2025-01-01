

 export interface Doctor {
  name: string;
  specialization: string; // Optional field
  email: string;
  phone: number;
  countryCode: number;
  gender: 'Male' | 'Female' | 'Other';
  isIndividual: boolean;
  role: string[];
  hospital?: string; // Reference to Hospital schema
  departments?: string[]; // References to Department schema
  fee?: number; // Optional field
  isActive: boolean;
  isVerified: boolean;
  createdAt: number;
  updatedAt?: number; // Optional field
  company: string;
  _id:string
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
  total: number;
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
  detail: (id:string) => Promise<any>;
}