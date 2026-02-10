import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Box, Stack, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import dayjs from "dayjs";
import { useAppContext } from "../../services/context/AppContext";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useAppointmentStore } from "../../services/appointment";
import { Appointment } from "../../types/appointment";
import { showError } from "../../services/toaster";
import GridDialog from "../../components/Dialog/GridDialog";
import { usePatientStore } from "../../services/patient";
import { useDoctorStore } from "../../services/doctors";
import { APPOINTMENT_STATUS, MODULES, PAYMENT_STATUS } from "../../utils/constants";
import PatientDetail from "../../components/PatientDetail";
import DoctorDetail from "../../components/DoctorDetail";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useCompanyStore } from "../../services/company";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import DoctorSelect from "../../components/DoctorSelect";
import LabSelect from "../../components/LabSelect";
import PatientSelectDropdown from "../../components/PatientSelect/PatientSelectDropdown";
import PatientSelect from "../../components/PatientSelect";
import DepartmentSelect from "../../components/DropDowns/DepartmentSelect/DepartmentSelect";
import moment from "moment";
import { PatientFilters } from "../../types/patient";
import DateTimePickerWithInterval from "../../components/DateTimePicker";
import DatePicker2 from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css"
import PackagetSelect from "../../components/DropDowns/PackageSelect/PackageSelect";
import ExternalAppointment from "./ExternalAppointment";
import AppointmentCommonFields from "./AppointmentCommonFields";
import TimePickerField from "../../components/TimePickerField";



export default function AppointmentDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {

  const { onCreate, detail, setFilters, filters, onUpdate } = useAppointmentStore();
  const { globalCompanyId } = useCompanyStore();
  const { data: patientData, totalPages: patientTotalPages, total: patientTotal, currentPage: patientCurrentPage, isLoading: patientIsLoading, onPageChange: patientOnPageChange, fetchGrid: patientFetchtGrid, onDelete: patientOnDelete } = usePatientStore();
  const { data: doctorData, totalPages: doctorTotalPages, total: doctorTotal, currentPage: doctorCurrentPage, isLoading: doctorIsLoading, onPageChange: doctorOnPageChange, fetchGrid: doctorFetchtGrid, onDelete: doctorOnDelete } = useDoctorStore();
  const { userData } = useAppContext();

  const [patientDialogOpen, setPatientDialogOpen] = React.useState(false);
  const [doctorDialogOpen, setDoctorDialogOpen] = React.useState(false);

  const defaultData = {
    fee: 0,
    type: "1",
    status: APPOINTMENT_STATUS.SCHEDULED,
    paymentStatus: PAYMENT_STATUS.PENDING,
    appointmentDate: "",
    timeSlot: {
      start: "",
      end: ""
    },
    lab: "",
    doctor: userData?.role?.includes("doctors") ? userData?._id : "",
    patient: "",
    company: globalCompanyId ?? "",
    location: {
      latitude: undefined,
      longitude: undefined
    },
    address: "",
    city: "",
    zipcode: ""
  }

  const [appointMentData, setAppointMentData] = React.useState<Appointment>(defaultData)

  const fetchData = async (id: string) => {
    try {
      const data = await detail(id)
      setAppointMentData({ ...data?.data, appointmentDate: dayjs(String(data?.data?.appointmentDate), "YYYYMMDD") })
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    setAppointMentData(defaultData)
    if (selectedId) {
      fetchData(selectedId)
    }
  }, [selectedId])

  const handleChange = (key: any, value: any) => {
    if (key.startsWith("timeSlot.")) {
      const field = key.split(".")[1];
      setAppointMentData({
        ...appointMentData,
        timeSlot: { ...appointMentData.timeSlot, [field]: value }
      });
    } else if (key.startsWith("location.")) {
      const field = key.split(".")[1];
      setAppointMentData({
        ...appointMentData,
        location: { ...appointMentData.location, [field]: value }
      });
    } else {
      setAppointMentData({ ...appointMentData, [key]: value });
    }
  };

  const handleChangeTimeSlot = (data: Partial<Appointment>) => {
    setAppointMentData({
      ...appointMentData,
      ...data
    });
  }

  const handlePatientDialogSave = (ids: string[]) => {
    setPatientDialogOpen(false)
    appointMentData.patient = ids?.length ? ids[0] : ""
  }

  const handleDoctorDialogSave = (ids: string[]) => {
    setDoctorDialogOpen(false)
    appointMentData.doctor = ids?.length ? ids[0] : ""
  }

  const handlePatientDialogClose = () => {
    setPatientDialogOpen(false)
  }

  const handleDoctorDialogClose = () => {
    setDoctorDialogOpen(false)
  }

  const handleSave = async () => {
    const data = { ...appointMentData }

    const date = dayjs(appointMentData.appointmentDate).format("YYYYMMDD");
    data.appointmentDate = date;

    if (data.patient?.length === 0) return showError("Please select a patient")
    if (!data.doctor) delete data.doctor;
    if (!data.lab) delete data.lab;

    if (data?._id) {
      onUpdate(data)
    } else {
      onCreate(data)
    }
    toggleModal()
  }

  if (Array.isArray(userData.role) && ![MODULES.ADMIN, MODULES.SUPERVISOR, MODULES.HR].some(role => userData.role.includes(role))) {
    return null;
  }

  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <div className="d-flex align-items-center" style={{ display: 'flex', alignItems: 'center' }}>
          <SearchInput />
          <PatientSelect
            sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
            value={filters?.patient}
            onSelect={function (id: string): void {
              const filter: PatientFilters = id ? { patient: id } : {}
              filter.company = globalCompanyId;
              setFilters(filter)
            }} />
        </div>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={toggleModal}
        >
          Book an Appointment
        </Button>
      </Stack>
      <GridDialog
        open={patientDialogOpen}
        handleClose={handlePatientDialogClose}
        handleSave={handlePatientDialogSave}
        data={patientData}
        totalPages={patientTotalPages}
        total={patientTotal}
        currentPage={patientCurrentPage}
        isLoading={patientIsLoading}
        onPageChange={patientOnPageChange}
        fetchGrid={patientFetchtGrid}
        onDelete={patientOnDelete}
        title="Patient"
      />

      <Drawer
        anchor="right"
        open={isModalOpen}
        onClose={toggleModal}
      >
        <Box sx={{ width: { xs: '100%', sm: 600 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Appointment Details</Typography>
            <IconButton onClick={toggleModal} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            <PatientSelect
              onSelect={function (id: string): void {
                setPatientDialogOpen(false)
                handleChange("patient", id);
              }}
              value={appointMentData?.patient}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="type">Select Type</InputLabel>
              <Select
                labelId="type"
                id="type"
                label="Select Type"
                value={appointMentData?.type}
                onChange={(e) => handleChange("type", e.target.value)}
              >
                <MenuItem value={"1"}>Report</MenuItem>
                <MenuItem value={"2"}>Prescription</MenuItem>
              </Select>
            </FormControl>

            {userData.role.includes("admin") && (
              <>
                {appointMentData?.type == "2" && (
                  <DoctorSelect
                    sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
                    value={appointMentData.doctor}
                    onSelect={(id: string): void => {
                      handleChange("doctor", id);
                    }}
                  />
                )}
              </>
            )}

            <AppointmentCommonFields
              handleChange={handleChange}
              appointMentData={appointMentData}
              module={MODULES.APPOINTMENT}
            />

            {/* New Fields Start */}
            <TextField
              fullWidth
              margin="dense"
              label="Address"
              value={appointMentData.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />

            <TextField
              fullWidth
              margin="dense"
              label="City"
              value={appointMentData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            />

            <TextField
              fullWidth
              margin="dense"
              label="Zip Code"
              value={appointMentData.zipcode || ""}
              onChange={(e) => handleChange("zipcode", e.target.value)}
            />

            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Box flex={1}>
                <TextField
                  label="Latitude"
                  type="number"
                  fullWidth
                  size="small"
                  value={appointMentData.location?.latitude || ""}
                  onChange={(e) =>
                    handleChange("location.latitude", parseFloat(e.target.value))
                  }
                />
              </Box>
              <Box flex={1}>
                <TextField
                  label="Longitude"
                  type="number"
                  fullWidth
                  size="small"
                  value={appointMentData.location?.longitude || ""}
                  onChange={(e) =>
                    handleChange("location.longitude", parseFloat(e.target.value))
                  }
                />
              </Box>
            </Stack>

            {/* New Fields End */}

            {appointMentData?.type == "2" ? (
              <>
                <DepartmentSelect
                  isMultiple={false}
                  value={appointMentData.department}
                  onChange={(value) => {
                    handleChange("department", value)
                  }}
                  module={MODULES.APPOINTMENT}
                />

                <TimePickerField
                  label="Start Time"
                  value={appointMentData?.timeSlot.start}
                  field="timeSlot.start"
                  onChange={handleChange}
                />

                <TimePickerField
                  label="End Time"
                  value={appointMentData?.timeSlot.end}
                  field="timeSlot.end"
                  onChange={handleChange}
                />
              </>
            ) : (
              <ExternalAppointment
                handleChange={handleChange}
                appointMentData={appointMentData}
                module={MODULES.APPOINTMENT}
                handleChangeTimeSlot={handleChangeTimeSlot}
              />
            )}
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={toggleModal}>Cancel</Button>
            <Button onClick={handleSave} type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
