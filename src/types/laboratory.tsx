

export interface Laboratory {
    name: string;
    email?: string;
    phone: number;
    countryCode?: number;
    address: string;
    isIndividual?: boolean;
    role?: string[];
    services: string[];
    departments: string[];
    hospital?: string; // Reference to Hospital schema
    fee?: number; 
    isVerified?: boolean;
    createdAt?: number;
    updatedAt?: number; // Optional field
    company: string;
    _id?:string;
  }
  
  export interface LaboratoryResponse {
    data: {
      rows: Laboratory[];
      totalPages: number;
    };
    status: number;
    message: string;
  }
  
  export interface LaboratoryFilters {
    // Add filter properties here
    [key: string]: any;
  }
  
  export interface LaboratoryState {
    data: Laboratory[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: LaboratoryFilters;
    isLoading: boolean;
    rows:number;
    fetchGrid: (page?: number, filters?: LaboratoryFilters) => Promise<void>;
    setFilters: (newFilters: LaboratoryFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null,page:number) => void;
    onCreate: (...args:any) => Promise<void>;
    onUpdate: (...args:any) => Promise<void>;
    onDelete: (...args:any) => Promise<void>;
    detail: (id:string) => Promise<any>;
  }