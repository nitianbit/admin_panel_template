import { Avatar } from "@mui/material";
import PatientDetail from "../../components/PatientDetail";
import DoctorDetail from "../../components/DoctorDetail";
import LabDetail from "../../components/LabDetail";

export const COLUMNS = [
  {
    header: "Avatar",
    accessor: "image",
    render: () => (
      <Avatar
        src={"https://i.pravatar.cc/300"}
        sx={{ height: "25%" }}
      />
    ),
  },
  {
    header: "Patient Name",
    accessor: "patient",
    render: (data: any) => <PatientDetail _id={data?.patient} />,
  },
  {
    header: "Contact Number",
    accessor: "patient_number",
    render: (data: any) => data?.patient_phone || "-",
  },
  {
  header: "Appointment Date",
  accessor: "appointmentDate",
  render: (data: any) => {
    const raw = data?.appointmentDate?.toString();
    if (!raw || raw.length !== 8) return "-";

    const year = raw.slice(0, 4);
    const month = raw.slice(4, 6);
    const day = raw.slice(6, 8);

    const date = new Date(`${year}-${month}-${day}`);
    return date.toDateString(); // Example: "Sun Jun 08 2025"
  },
},
  {
    header: "Type",
    accessor: "type",
    render: (data: any) =>
      data.type === 1 ? "Report" : "Prescription",
  },
  {
  header: "Doctor/Lab",
  accessor: "type",
  render: (data: any) =>
    data.type === 1
      ? data?.laboratory_name || "-"
      : data?.doctor_name || "-",
},
  {
    header: "Vendor",
    accessor: "vendor",
    render: (data: any) => data?.vendor || "-",
  },
];
