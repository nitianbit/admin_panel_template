import { Avatar, Chip, Stack, Typography } from "@mui/material";
import moment from "moment";
import CustomImage from "../../components/CustomImage";

export const COLUMNS = [
    {
        header: "User",
        accessor: "name",
        render: (item: any) => (
            <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 40, height: 40 }}>
                    {item.profilePictureUrl ? (
                        <CustomImage src={item.profilePictureUrl} />
                    ) : (
                        item.name?.charAt(0).toUpperCase()
                    )}
                </Avatar>
                <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{item.email}</Typography>
                </Stack>
            </Stack>
        ),
    },
    {
        header: "Phone",
        accessor: "phone",
    },
    {
        header: "Type",
        accessor: "userType",
        render: (item: any) => (
            <Chip
                label={item.userType?.toUpperCase() || 'USER'}
                color={item.userType === 'admin' ? "secondary" : "default"}
                size="small"
                variant="outlined"
            />
        ),
    },
    {
        header: "Location",
        accessor: "city",
        render: (item: any) => (
            <Typography variant="body2">
                {item.city}{item.state ? `, ${item.state}` : ''}
            </Typography>
        ),
    },
    {
        header: "Status",
        accessor: "isActive",
        render: (item: any) => (
            <Stack direction="row" spacing={1}>
                <Chip
                    label={item.isActive ? "Active" : "Inactive"}
                    color={item.isActive ? "success" : "error"}
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
            </Stack>
        ),
    },
    {
        header: "Joined On",
        accessor: "createdAt",
        render: (item: any) => moment(item.createdAt).format("DD MMM YYYY"),
    },
];
