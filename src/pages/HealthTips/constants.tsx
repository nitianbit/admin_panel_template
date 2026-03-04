import { Avatar, Chip } from "@mui/material";
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
                    style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }}
                />
            ) : (
                <Avatar sx={{ width: 40, height: 40, borderRadius: 1 }} variant="rounded">
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
        header: "Category",
        accessor: "category",
        render: (data: any) => data.category || "-"
    },
    {
        header: "Status",
        accessor: "isActive",
        render: (data: any) => (
            <Chip
                label={data.isActive ? "Active" : "Inactive"}
                color={data.isActive ? "success" : "default"}
                size="small"
            />
        )
    },
    {
        header: "Order",
        accessor: "order",
    },
    {
        header: "Date",
        accessor: "createdAt",
        render: (data: any) =>
            data?.createdAt ? moment(data.createdAt).format("DD-MM-YYYY") : "-",
    }
];
