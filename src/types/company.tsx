

export interface Company {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    countryCode?: string;
    contactPerson: string;
    noOfEmployees: number;
    website: string,
    logo?: string,
    isActive: boolean,
    email:string,
    phone: number;
    countryCode?: number;
    contactperson: string;
    noOfUser: number;
}

export interface CompanyResponse {
    data: {
        rows: Company[];
        totalPages: number;
    };
    status: number;
    message: string;
}

export interface CompanyFilters {
    // Add filter properties here
    [key: string]: any;
}

export interface CompanyState {
    data: Company[];
    totalPages: number;
    total: number;
    currentPage: number;
    filters: CompanyFilters;
    isLoading: boolean;
    rows: number;
    globalCompanyId?:string;
    fetchGrid: (page?: number, filters?: CompanyFilters) => Promise<void>;
    setFilters: (newFilters: CompanyFilters) => void;
    setGlobalCompanyId: (id: string) => void;
    nextPage: () => void;
    prevPage: () => void;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
    onCreate: (...args: any) => Promise<void>;
    onUpdate: (...args: any) => Promise<void>;
    onDelete: (...args: any) => Promise<void>;
    detail: (id:string) => Promise<any>;
}