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
        header: "Patient NAME",
        accessor: `patient`,
    },
    {
        header: "Doctor NAME",
        accessor: "doctor",
    },
    {
        header: "Hospital",
        accessor: "hospital",
    },
]