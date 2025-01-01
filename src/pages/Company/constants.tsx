import { Avatar } from "@mui/material";
import { Company } from "../../types/company";

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
        header: "Company NAME",
        accessor: `name`,
    },
    {
        header: "Company Website",
        accessor: "website",
    },
    {
        header: "Is Active",
        accessor: "isActive",
        render: (data:Company) => <>
            {data.isActive ? "Yes" : "No"}
        </>,
    },
]