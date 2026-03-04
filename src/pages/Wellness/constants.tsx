import { Avatar } from "@mui/material";
import moment from "moment";
import CompanyDetail from "../../components/CompanyDetail";

export const COLUMNS = [

    {
        header: "Event Title",
        accessor: "title",
    },
    {
        header: "Date",
        accessor: "startTime",
        render: (data: any) => moment.unix(data?.startTime).format("DD-MM-YYYY")
    },
    {
        header: "Time",
        accessor: "startTime",
        render: (data: any) => moment.unix(data?.startTime).format("HH:mm A")
    },
    {
        header: "Company",
        accessor: "company",
        render: (data: any) => <CompanyDetail _id={data?.company} />
    },
    {
        header: "Description",
        accessor: "description",
    },
    {
        header: "Active",
        accessor: "active",
        render: (data: any) => (
            <div
                style={{
                    background: data?.active ? "green" : "red",
                    color: "white",
                    padding: "2px 5px",
                    borderRadius: "5px",
                }}
            >
                {data?.active ? "Active" : "Inactive"}
            </div>
        ),
    },
]