import { Avatar } from "@mui/material";
import moment from "moment";

export const COLUMNS = [
  
    {
        header: "Title",
        accessor: "tile",
    },
    {
        header: "Author",
        accessor: "author",
    },
    {
        header: "Creation Date",
        accessor: "createdAt",
        render: (data: any) =>
            data?.createdAt ? moment.unix(data.createdAt).format("DD-MM-YYYY hh:mm A") : "-",
    }
]