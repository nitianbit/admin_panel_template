
import { Chip, Typography } from "@mui/material";

export const COLUMNS = [
    {
        header: "Name",
        accessor: "name",
        render: (item: any) => (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
        )
    },
    {
        header: "Company",
        accessor: "companyName",
        render: (item: any) => (
            <Typography variant="body2">{item.companyName || '-'}</Typography>
        )
    },
    {
        header: "Industry",
        accessor: "industry",
        render: (item: any) => (
            <Typography variant="body2">{item.industry || '-'}</Typography>
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
        header: "Employees",
        accessor: "employeeCount",
        render: (item: any) => (
            <Typography variant="body2">{item.employeeCount || '-'}</Typography>
        )
    },
    {
        header: "Status",
        accessor: "isActive",
        render: (item: any) => (
            <Chip
                label={item.isActive ? 'Active' : 'Inactive'}
                color={item.isActive ? 'success' : 'default'}
                size="small"
            />
        )
    },
];

export const INDUSTRIES = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Transportation",
    "Construction",
    "Hospitality",
    "Other"
];
