import { Avatar } from "@mui/material";
import DepartmentDetail from "../../components/DepartmentDetail";

export const COLUMNS = [
  
    {
        header: "Service Name",
        accessor: "name",
    },
    {
        header: "Service Type",
        accessor: "type",
    },
    {
        header: "Department",
        accessor: "department",
        render:(data: any)=><DepartmentDetail  _id={data?.department}/>
    },
]


export const SERVICE_TYPE = {
    LAB_TEST: "Lab Test",
    CONSULTATION: "Consultation",
}