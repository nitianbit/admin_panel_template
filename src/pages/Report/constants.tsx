
import { Report } from "../../types/report";
import CompanyDetail from "../../components/CompanyDetail";
import moment from "moment";
 import PatientDetail from "../../components/PatientDetail";
import LabDetail from "../../components/LabDetail";
import DoctorDetail from "../../components/DoctorDetail";

export const COLUMNS = [
    {
        header: "Company Name",
        accessor: `name`,
        render: (data:Report) => <CompanyDetail _id={data?.company}/>,
    },
    {
        header: "Date",
        accessor: "date",
        render: (data:Report) => moment.unix(data.date).format("DD-MM-YYYY"),
    },
    {
        header: "Patient",
        accessor: "patient",
        render: (data:Report) => <PatientDetail _id={data?.patient}/>,
    },
    {
        header: "Type",
        accessor: "type",
        render:(data:Report) => data.type === 1 ? "Report" : "Prescription",
    },
    {
        header:  "Doctor/Lab",
        accessor: "type",
        render:(data:Report) => data.type === 1 ?(data?.lab? <LabDetail _id={data?.lab}/>: null) : (data?.doctor? <DoctorDetail _id={data?.doctor}/>: null),
    }
]