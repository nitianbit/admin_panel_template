import { Avatar } from "@mui/material";
import CompanyDetail from "../../components/CompanyDetail";

export const COLUMNS = [
    {
        header: "AVATAR",
        accessor:"image",
        render: () => <Avatar
            src={"https://i.pravatar.cc/300"}
            sx={{
                height: "25%"
            }}
        />,
    },
    {
        header: "Lab NAME",
        accessor: "name",
    },
    {
        header: "Email",
        accessor: "email",
    },
    {
        header: "Phone",
        accessor: "phone",
    },
    {
        header: "Company",
        accessor: "specialization",
        render:(data: any)=><CompanyDetail _id={data?.company}/>
    },
]