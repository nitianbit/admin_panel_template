

export interface Patient {
  name: string;
  phone: number | string;
  age: number | string;
  email?: string;
  countryCode?: number;
  gender: string;
  createdAt?: number;
  balance?: number;
  role?: string;
  address: string;
  city?: string;
  company: string;
  state?: string;
  profiePic?: string;
  password?: string;
  disabled?: boolean;
  isVerified?: boolean;
  _id?: string;
  height?:number,
  weight?:number
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
  total: number;
  currentPage: number;
  filters: PatientFilters;
  isLoading: boolean;
  rows: number;
  fetchGrid: (page?: number, filters?: PatientFilters) => Promise<void>;
  setFilters: (newFilters: PatientFilters) => void;
  nextPage: () => void;
  prevPage: () => void;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  onCreate: (...args: any) => Promise<void>;
  onBulkCreate: (...args: any) => Promise<void>;
  onUpdate: (...args: any) => Promise<void>;
  onDelete: (...args: any) => Promise<void>;
  detail: (id:string) => Promise<any>;
  resetExtraFilters: () => void;
}