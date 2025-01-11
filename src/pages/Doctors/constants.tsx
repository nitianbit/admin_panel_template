import { Avatar } from "@mui/material";
import ServiceDetail from "../../components/ServiceDetail";

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
        header: "DOCTOR NAME",
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
        header: "SPECIALIST",
        accessor: "specialization",
    },
    {
        header: "Service",
        accessor: "services",
        render:(data: any)=><ServiceDetail ids={data?.services}/>
    },
]