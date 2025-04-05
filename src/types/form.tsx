export interface FormData {
    _id?: string;
    full_name: string;
    age: string;
    gender: 'male' | 'female' | 'others';
    email: string;
    mobile: string;
    address: string;
    enquire_about: string;
  }
  
  export interface FormResponse {
    data: {
      rows: FormData[];
      totalPages: number;
    };
    status: number;
    message: string;
  }
  
  export interface FormFilters {
    [key: string]: any;
  }
  
  export interface FormState {
    data: FormData[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: FormFilters;
    isLoading: boolean;
    rows: number;
    fetchGrid: (page?: number, filters?: FormFilters) => Promise<void>;
    setFilters: (newFilters: FormFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<FormData | null>;
    onUpdate: (...args: any) => Promise<FormData | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: FormData }>;
  }
  