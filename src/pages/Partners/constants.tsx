import { Avatar, Chip, Typography } from "@mui/material";
import moment from "moment";
import CustomImage from "../../components/CustomImage";

export const getColumns = (currentPage: number, rows: number) => [
    {
        header: "S.No.",
        accessor: "_index",
        render: (_row: any, index?: number) => (currentPage - 1) * rows + (index ?? 0) + 1,
    },
    {
        header: "Logo",
        accessor: "logoUrl",
        render: (item: any) => (
            item.logoUrl ? (
                <CustomImage src={item.logoUrl} style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'contain' }} />
            ) : (
                <Avatar variant="rounded" sx={{ width: 40, height: 40 }}>{item.name?.charAt(0)}</Avatar>
            )
        ),
    },
    {
        header: "Name",
        accessor: "name",
        render: (item: any) => (
            <div>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                <Typography variant="caption" color="textSecondary">{item.partnerType?.toUpperCase()}</Typography>
            </div>
        )
    },
    {
        header: "Contact Info",
        accessor: "email",
        render: (item: any) => (
            <div>
                <Typography variant="caption" display="block">{item.email || '-'}</Typography>
                <Typography variant="caption" color="textSecondary">{item.phone || '-'}</Typography>
            </div>
        )
    },
    {
        header: "Location",
        accessor: "city",
        render: (item: any) => (
            <Typography variant="body2">{item.city}{item.state ? `, ${item.state}` : ''}</Typography>
        )
    },
    {
        header: "Status",
        accessor: "isActive",
        render: (item: any) => (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Chip
                    label={item.isActive ? "Active" : "Inactive"}
                    color={item.isActive ? "success" : "default"}
                    size="small"
                />
                {item.isVerified && (
                    <Chip
                        label="Verified"
                        color="primary"
                        size="small"
                        variant="outlined"
                    />
                )}
            </div>
        )
    },
    {
        header: "Order",
        accessor: "order",
    },
    {
        header: "Added On",
        accessor: "createdAt",
        render: (item: any) => moment(item.createdAt).format("DD MMM YYYY"),
    },
];
