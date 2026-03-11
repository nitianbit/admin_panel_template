
import { Chip, Typography } from "@mui/material";

export const BOOKING_TYPES = [
    { value: 'package', label: 'Wellness Package' },
    { value: 'consultation', label: 'Specialist Consultation' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'second-opinion', label: 'Second Opinion' },
];

export const SERVICE_MODES = [
    { value: 'in-person', label: 'In-Person' },
    { value: 'pickup', label: 'Home Pickup' },
    { value: 'chat', label: 'Chat' },
    { value: 'call', label: 'Call' },
];

export const CONSULTATION_MODES = [
    { value: 'chat', label: 'Chat' },
    { value: 'call', label: 'Call' },
    { value: 'in-person', label: 'In-Person' },
];

export const BOOKING_STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const PAYMENT_STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
];

const formatDate = (value: string) => {
    if (!value) return '-';
    if (value.length === 8) {
        return `${value.substring(6, 8)}/${value.substring(4, 6)}/${value.substring(0, 4)}`;
    }
    return value;
}

export const COLUMNS = [
    {
        header: 'Date',
        accessor: 'bookingDate',
        render: (item: any) => (
            <Typography variant="body2">{formatDate(item.bookingDate)}</Typography>
        )
    },
    {
        header: 'Time',
        accessor: 'bookingTime',
        render: (item: any) => (
            <Typography variant="body2">{item.bookingTime}</Typography>
        )
    },
    {
        header: 'Type',
        accessor: 'bookingType',
        render: (item: any) => {
            const type = BOOKING_TYPES.find(t => t.value === item.bookingType);
            return <Typography variant="body2">{type ? type.label : item.bookingType}</Typography>;
        }
    },
    {
        header: 'Mode',
        accessor: 'serviceMode',
        render: (item: any) => {
            const mode = SERVICE_MODES.find(m => m.value === item.serviceMode);
            return <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{mode ? mode.label : item.serviceMode}</Typography>;
        }
    },
    {
        header: 'Status',
        accessor: 'status',
        render: (item: any) => {
            const status = BOOKING_STATUSES.find(s => s.value === item.status);
            let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
            if (item.status === 'confirmed' || item.status === 'completed') color = "success";
            if (item.status === 'pending') color = "warning";
            if (item.status === 'cancelled') color = "error";

            return <Chip label={status ? status.label : item.status} color={color} size="small" />;
        }
    },
    {
        header: 'Payment',
        accessor: 'paymentStatus',
        render: (item: any) => {
            const status = PAYMENT_STATUSES.find(s => s.value === item.paymentStatus);
            let color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" = "default";
            if (item.paymentStatus === 'paid') color = "success";
            if (item.paymentStatus === 'pending') color = "warning";
            if (item.paymentStatus === 'failed') color = "error";
            if (item.paymentStatus === 'refunded') color = "info";

            return <Chip label={status ? status.label : item.paymentStatus} color={color} size="small" variant="outlined" />;
        }
    },
    {
        header: 'Price',
        accessor: 'price',
        render: (item: any) => (
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.price ? `₹${item.price}` : '-'}</Typography>
        )
    }
];
