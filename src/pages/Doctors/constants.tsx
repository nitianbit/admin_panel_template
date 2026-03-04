import { useState } from "react";
import { Avatar, Box, Typography, IconButton, Badge } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ServiceDetail from "../../components/ServiceDetail";
import DepartmentDetail from "../../components/DepartmentDetail";

const AvatarCell = () => {
    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <IconButton
                    component="label"
                    color="primary"
                    size="small"
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 1,
                        width: 22,
                        height: 22,
                        '&:hover': { bgcolor: 'background.default' }
                    }}
                >
                    <CameraAltIcon sx={{ fontSize: 14 }} />
                    <input hidden accept="image/*" type="file" />
                </IconButton>
            }
        >
            <Avatar
                src={"https://i.pravatar.cc/300"}
                sx={{ width: 40, height: 40 }}
            />
        </Badge>
    );
};

const DescriptionCell = ({ text }: { text: string }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return null;

    return (
        <Box sx={{ minWidth: 200, maxWidth: 300 }}>
            <Typography
                variant="body2"
                sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: expanded ? 'none' : 2,
                    mb: 0.5
                }}
            >
                {text}
            </Typography>
            {text.length > 50 && (
                <Typography
                    variant="caption"
                    color="primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}
                    sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {expanded ? 'Read Less' : 'Read More'}
                </Typography>
            )}
        </Box>
    );
};

export const COLUMNS = [
    {
        header: "AVATAR",
        accessor: "image",
        render: () => <AvatarCell />,
    },
    {
        header: "DOCTOR NAME",
        accessor: "name",
    },
    {
        header: "Email",
        accessor: "email",
    },
    {
        header: "Phone",
        accessor: "phone",
    },
    {
        header: "SPECIALIST",
        accessor: "specialization",
    },
    {
        header: "Service",
        accessor: "services",
        render: (data: any) => <ServiceDetail _id={data?.services} />
    },
    {
        header: "Departments",
        accessor: "departments",
        render: (data: any) => <DepartmentDetail _id={data?.departments} />
    },
    {
        header: "Description",
        accessor: "description",
        render: (data: any) => <DescriptionCell text={data?.description} />
    },
]
