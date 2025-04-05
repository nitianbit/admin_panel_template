export interface BlogData {
    _id?: string;
    title: string;
    author: string;
    description: string;
    image: string;
  }
  
  export interface BlogResponse {
    data: {
      rows: BlogData[];
      totalPages: number;
    };
    status: number;
    message: string;
  }
  
  export interface BlogFilters {
    [key: string]: any;
  }
  
  export interface BlogState {
    data: BlogData[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: BlogFilters;
    isLoading: boolean;
    rows: number;
  
    fetchGrid: (page?: number, filters?: BlogFilters) => Promise<void>;
    setFilters: (newFilters: BlogFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement> | null,
      page: number
    ) => void;
    onCreate: (...args: any) => Promise<BlogData | null>;
    onUpdate: (...args: any) => Promise<BlogData | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: BlogData }>;
  }
  