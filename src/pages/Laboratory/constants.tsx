import { useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";
import CompanyDetail from "../../components/CompanyDetail";
import ServiceDetail from "../../components/ServiceDetail";
import DepartmentDetail from "../../components/DepartmentDetail";

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
        render: () => <Avatar
            src={"https://i.pravatar.cc/300"}
            sx={{
                height: "25%"
            }}
        />,
    },
    {
        header: "Lab NAME",
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
        header: "Company",
        accessor: "specialization",
        render: (data: any) => <CompanyDetail _id={data?.company} />
    },
    {
        header: "Service",
        accessor: "services",
        render: (data: any) => <ServiceDetail _id={data?.services} />
    },
    {
        header: "Department",
        accessor: "departments",
        render: (data: any) => <DepartmentDetail _id={data?.departments} />
    },
    {
        header: "Description",
        accessor: "description",
        render: (data: any) => <DescriptionCell text={data?.description} />
    },
]