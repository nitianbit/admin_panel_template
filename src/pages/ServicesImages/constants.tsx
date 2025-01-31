import CompanyDetail from "../../components/CompanyDetail";
import moment from "moment";

export const COLUMNS = [
    {
        header: "Services Images Title",
        accessor: "name",
    },
    {
        header: "Company",
        accessor: "company",
        render: (data: any) => <CompanyDetail _id={data?.company} />
    },
    {
        header: "Expires At",
        accessor: "expireAt",
        render: (data: any) => moment.unix(data?.expireAt).format("DD-MM-YYYY")
    },
    {
        header: "Active",
        accessor: "active",
        render: (data: any) => (data?.active ? "Yes" : "No")
    },
]