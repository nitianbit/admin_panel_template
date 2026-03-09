import { Avatar } from "@mui/material";
import CustomImage from "../../components/CustomImage";

export const getColumns = (currentPage: number, rows: number) => [
    {
        header: "S.No.",
        accessor: "_index",
        render: (_row: any, index?: number) => (currentPage - 1) * rows + (index ?? 0) + 1,
    },
    {
        header: "Photo",
        accessor: "profilePictureUrl",
        render: (data: any) => (
            data.profilePictureUrl ? (
                <CustomImage
                    src={data.profilePictureUrl}
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
        header: "Specialization",
        accessor: "specialization",
    },
    {
        header: "Degree",
        accessor: "degree",
    },
    {
        header: "Experience (Years)",
        accessor: "experienceYears",
    },
    {
        header: "Consultation Fee",
        accessor: "consultationFee",
    },
    {
        header: "Rating",
        accessor: "rating",
    },
    {
        header: "Phone",
        accessor: "phone",
    },
    {
        header: "City",
        accessor: "city",
    },
    {
        header: "Status",
        accessor: "isActive",
        render: (row: any) => row.isActive ? "Active" : "Inactive",
    },
    {
        header: "Verified",
        accessor: "isVerified",
        render: (row: any) => row.isVerified ? "Verified" : "Unverified",
    }
]

