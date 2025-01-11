import { Avatar } from "@mui/material";
import PatientDetail from "../../components/PatientDetail";
import DoctorDetail from "../../components/DoctorDetail";

export const COLUMNS = [
    {
        header: "AVATAR",
        accessor:"image",
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
        render:(data: any)=><PatientDetail  _id={data?.patient}/>
    },
    {
        header: "Doctor NAME",
        accessor: "doctor",
        render:(data: any)=><DoctorDetail  _id={data?.doctor}/>
    },
    {
        header: "Hospital",
        accessor: "hospital",
    },
]