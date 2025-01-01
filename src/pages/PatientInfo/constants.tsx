import { Avatar } from "@mui/material";

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
        header: "Name",
        accessor: "name",
    },
    {
        header: "Gender",
        accessor: "gender",
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
        header: "Age",
        accessor: "age",
    },
    {
        header: "Company",
        accessor: "company",
    },
    {
        header: "Address",
        accessor: "address",
    },
]