
import { Chip, Tooltip, Typography } from "@mui/material";
import dayjs from "dayjs";

export const COLUMNS = [
    {
        header: "Code",
        accessor: "code",
        render: (item: any) => (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.code}</Typography>
        )
    },
    {
        header: "Discount",
        accessor: "discountValue",
        render: (item: any) => (
            <Typography variant="body2">
                {item.discountType === 'percentage' ? `${item.discountValue}%` : `₹${item.discountValue}`}
            </Typography>
        )
    },
    {
        header: "Applicable To",
        accessor: "applicableTo",
        render: (item: any) => (
            <Chip
                label={item.applicableTo}
                color="info"
                size="small"
                variant="outlined"
                sx={{ textTransform: 'capitalize' }}
            />
        )
    },
    {
        header: "Validity",
        accessor: "startDate",
        render: (item: any) => (
            <Typography variant="caption" display="block">
                {formatDate(item.startDate)} - {formatDate(item.endDate)}
            </Typography>
        )
    },
    {
        header: "Usage",
        accessor: "currentUsageCount",
        render: (item: any) => (
            <Tooltip title={`Limit: ${item.totalUsageLimit !== null ? item.totalUsageLimit : 'Unlimited'}`}>
                <Typography variant="body2">
                    {item.currentUsageCount} Used
                </Typography>
            </Tooltip>
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

const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    if (dateStr.length === 8) {
        return dayjs(dateStr).format('DD MMM YYYY');
    }
    return dateStr;
}

export const DISCOUNT_TYPES = [
    { label: 'Percentage', value: 'percentage' },
    { label: 'Fixed Amount', value: 'fixed' },
];

export const APPLICABLE_TO_TYPES = [
    { label: 'All', value: 'all' },
    { label: 'Wellness Package', value: 'wellnessPackage' },
    { label: 'Consultation', value: 'consultation' },
    // { label: 'Specific', value: 'specific' }, // To be implemented if needed
];
