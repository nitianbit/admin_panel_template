import { Avatar } from "@mui/material";
import moment from "moment";
import CustomImage from "../../components/CustomImage";

export const getColumns = (currentPage: number, rows: number) => [
    {
        header: "S.No.",
        accessor: "_index",
        render: (_row: any, index?: number) => (currentPage - 1) * rows + (index ?? 0) + 1,
    },
    {
        header: "Image",
        accessor: "imageUrl",
        render: (data: any) => (
            data.imageUrl ? (
                <CustomImage
                    src={data.imageUrl}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
            ) : (
                <Avatar sx={{ width: 40, height: 40 }}>
                    {data.title?.charAt(0)}
                </Avatar>
            )
        )
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
