import { Avatar } from "@mui/material";
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
                    {data.name?.charAt(0)}
                </Avatar>
            )
        )
    },
    {
        header: "Name",
        accessor: "name",
    },
    {
        header: "Category",
        accessor: "category",
    },
    {
        header: "Original Price",
        accessor: "originalPrice",
    },
    {
        header: "Discounted Price",
        accessor: "discountedPrice",
    },
    {
        header: "Total Tests",
        accessor: "totalTestsCount",
    },
    {
        header: "Order",
        accessor: "order",
    },
    {
        header: "Popular",
        accessor: "isPopular",
        render: (row: any) => row.isPopular ? "Yes" : "No",
    },
    {
        header: "Free Consultation",
        accessor: "hasFreeDoctorConsultation",
        render: (row: any) => row.hasFreeDoctorConsultation ? "Yes" : "No",
    },
    {
        header: "Status",
        accessor: "isActive",
        render: (row: any) => row.isActive ? "Active" : "Inactive",
    },

]
