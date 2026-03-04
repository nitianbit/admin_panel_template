import moment from "moment";

export const getColumns = (currentPage: number, rows: number) => [
    {
        header: "S.No.",
        accessor: "_index",
        render: (_row: any, index?: number) => (currentPage - 1) * rows + (index ?? 0) + 1,
    },
    {
        header: "Title",
        accessor: "title",
    },
    {
        header: "Banner Type",
        accessor: "bannerType",
    },
    {
        header: "Target",
        accessor: "target",
    },
    {
        header: "Start Date",
        accessor: "startDate",
        cell: (row: any) => row.startDate ? moment(row.startDate).format("DD/MM/YYYY") : "-",
    },
    {
        header: "End Date",
        accessor: "endDate",
        cell: (row: any) => row.endDate ? moment(row.endDate).format("DD/MM/YYYY") : "-",
    },
    {
        header: "Order",
        accessor: "order",
    },
    {
        header: "Status",
        accessor: "isActive",
        cell: (row: any) => row.isActive ? "Active" : "Inactive",
    },
]
