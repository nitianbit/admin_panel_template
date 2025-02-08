

export interface Column {
  header: string; // Column header text
  accessor: string; // Field name from the data object
  render?: (row: any) => React.ReactNode; // Optional custom render function
}

export interface GridDialogProps {
  open: boolean;
  handleClose: () => void;
  handleSave: (selectedIds: any[]) => void;
  data: any[]; // Array of data objects
  totalPages: number;
  total: number;
  currentPage: number;
  isLoading:boolean;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  columns?: Column[]; // Array of column definitions
  spacing?: number; // Optional grid spacing
  styles?: Record<string, any>; // Optional custom styles,
  onDelete: (id: string) => void;
  fetchGrid: () => void;
  rows?: number; // Optional number of rows per page
  filters?: any; // Optional filters for the table
  title: string;
  fullScreen?: boolean;
  hideAction?:boolean
}