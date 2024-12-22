

export interface Column {
    header: string; // Column header text
    accessor: string; // Field name from the data object
    render?: (row: any) => React.ReactNode; // Optional custom render function
  }
  
export interface GridTableProps {
    data: any[]; // Array of data objects
    columns: Column[]; // Array of column definitions
    spacing?: number; // Optional grid spacing
    styles?: Record<string, any>; // Optional custom styles,
    currentPage:number;
    totalPages:number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null,page:number) => void;
    loading:boolean;
    module:string;
    [key: string]: any; //for any extra data
  }