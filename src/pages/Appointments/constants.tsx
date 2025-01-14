import { Avatar } from "@mui/material";
import PatientDetail from "../../components/PatientDetail";
import DoctorDetail from "../../components/DoctorDetail";
import LabDetail from "../../components/LabDetail";

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
        header: "Patient NAME",
        accessor: `patient`,
        render: (data: any) => <PatientDetail _id={data?.patient} />
    },
    {
        header: "Type",
        accessor: "type",
        render: (data: any) => data.type == "1" ? "Report" : "Prescription",
    },
    {
        header: "Doctor/Lab",
        accessor: "type",
        render: (data: any) => data.type == "1" ? (data?.lab ? <LabDetail _id={data?.lab} /> : null) : (data?.doctor ? <DoctorDetail _id={data?.doctor} /> : null),
    },
    {
        header: "Hospital",
        accessor: "hospital",
    },
]