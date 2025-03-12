import CompanyDetail from "../../components/CompanyDetail";
import moment from "moment";

export const COLUMNS = [
    {
        header: "Notification Title",
        accessor: "notification.title",
    },
    // {
    //     header: "Company",
    //     accessor: "company",
    //     render: (data: any) => <CompanyDetail _id={data?.company} />
    // },
    {
        header: "Scheduled At",
        accessor: "scheduledTime",
        render: (data: any) => moment.unix(data?.scheduledTime).format("DD-MM-YYYY")
    },
    {
        header: "Status",
        accessor: "status",
    },
]