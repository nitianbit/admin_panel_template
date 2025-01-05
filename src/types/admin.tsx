

export interface Admin {
    name: string;
    email?: string;
    phone: number;
    countryCode?: number;
    address: string;
    isIndividual?: boolean;
    role?: string[];
    profilePic?: string;
    hospital?: string; // Reference to Hospital schema
    fee?: number; 
    isVerified?: boolean;
    disabled?: boolean;
    createdAt?: number;
    updatedAt?: number; // Optional field
    company: string;
    _id?:string;
  }
  
  export interface AdminResponse {
    data: {
      rows: Admin[];
      totalPages: number;
    };
    status: number;
    message: string;
  }
  
  export interface AdminFilters {
    // Add filter properties here
    [key: string]: any;
  }
  
  export interface AdminState {
    data: Admin[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: AdminFilters;
    isLoading: boolean;
    rows:number;
    fetchGrid: (page?: number, filters?: AdminFilters) => Promise<void>;
    setFilters: (newFilters: AdminFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null,page:number) => void;
    onCreate: (...args:any) => Promise<void>;
    onUpdate: (...args:any) => Promise<void>;
    onDelete: (...args:any) => Promise<void>;
    detail: (id:string) => Promise<any>;
  }