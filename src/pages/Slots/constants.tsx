
import { Chip, Typography } from "@mui/material";
import dayjs from "dayjs";

export const getColumns = (currentPage: number, rows: number) => [
    {
        header: "S.No.",
        accessor: "_index",
        render: (_row: any, index?: number) => (currentPage - 1) * rows + (index ?? 0) + 1,
    },
    {
        header: "Date",
        accessor: "date",
        render: (item: any) => (
            item.date && item.date.length === 8
                ? dayjs(item.date).format('DD MMM YYYY')
                : item.date
        )
    },
    {
        header: "Time",
        accessor: "startTime",
        render: (item: any) => (
            <Typography variant="body2">
                {item.startTime} - {item.endTime}
            </Typography>
        )
    },
    {
        header: "Type",
        accessor: "slotType",
        render: (item: any) => (
            <Chip
                label={item.slotType}
                color={item.slotType === 'consultation' ? 'primary' : 'secondary'}
                size="small"
            />
        )
    },
    {
        header: "Status",
        accessor: "isAvailable",
        render: (item: any) => (
            <Chip
                label={item.isAvailable ? 'Available' : 'Booked/Unavailable'}
                color={item.isAvailable ? 'success' : 'error'}
                size="small"
            />
        )
    },
    {
        header: "Bookings",
        accessor: "currentBookings",
        render: (item: any) => (
            <Typography variant="body2">
                {item.currentBookings} / {item.maxBookings || '-'}
            </Typography>
        )
    },
    {
        header: "Recurring",
        accessor: "isRecurring",
        render: (item: any) => item.isRecurring ? (
            <Chip
                label={item.recurringPattern || 'Yes'}
                color="info"
                size="small"
                variant="outlined"
            />
        ) : '-'
    }
];

export const SLOT_TYPES = [
    { label: 'Specialist', value: 'consultation' },
    { label: 'Wellness Package', value: 'wellnessPackage' },
];

export const RECURRING_PATTERNS = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
];
