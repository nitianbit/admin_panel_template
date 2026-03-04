export interface SuperBlogData {
  _id?: string;
  title: string;
  author: string;
  date: string;
  blogs: string[];  // Blog IDs
  image: string,
}

  
  export interface SuperBlogResponse {
    data: {
      rows: SuperBlogData[];
      totalPages: number;
    };
    status: number;
    message: string;
  }
  
  export interface SuperBlogFilters {
    [key: string]: any;
  }
  
  export interface SuperBlogState {
    data: SuperBlogData[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: SuperBlogFilters;
    isLoading: boolean;
    rows: number;
  
    fetchGrid: (page?: number, filters?: SuperBlogFilters) => Promise<void>;
    setFilters: (newFilters: SuperBlogFilters) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (
      event: React.MouseEvent<HTMLButtonElement> | null,
      page: number
    ) => void;
    onCreate: (...args: any) => Promise<SuperBlogData | null>;
    onUpdate: (...args: any) => Promise<SuperBlogData | null>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id: string) => Promise<{ data: SuperBlogData }>;
  }
  