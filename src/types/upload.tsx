

export interface Column {
    header: string; // Column header text
    accessor: string; // Field name from the data object
    render?: (row: any) => React.ReactNode; // Optional custom render function
  }
  
  export interface UploadProps {
    module:string;
    record_id:string
  }