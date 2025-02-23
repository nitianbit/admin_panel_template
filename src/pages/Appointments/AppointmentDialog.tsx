import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    status: "SCHD",
    paymentStatus: "PND",
    appointmentDate: "",
    timeSlot: {
      start: "",
      end: ""
    },
    lab: "",
    doctor: userData?.role?.includes("doctors") ? userData?._id : "",
    patient: "",
    company: globalCompanyId ?? ""
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
      const field = key.split(".")[1]; // Extract 'start' or 'end'
      setAppointMentData({
        ...appointMentData,
        timeSlot: { ...appointMentData.timeSlot, [field]: value }
      });
    } else {
      setAppointMentData({ ...appointMentData, [key]: value });
    }
  };



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
    // const startTime = dayjs(appointMentData.timeSlot.start).format("HHmm");
    // const endTime = dayjs(appointMentData.timeSlot.end).format("HHmm");
    data.appointmentDate = date;
    // data.timeSlot["start"] = startTime
    // data.timeSlot["end"] = endTime;

    if (data.patient?.length === 0) return showError("Please select a patient")
    if (!data.doctor) delete data.doctor;
    if (!data.lab) delete data.lab;
    // \    if(!data.lab)delete data.lab;
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


      <Dialog
        open={isModalOpen}
        onClose={toggleModal}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        sx={{ height: "100%" }}
      >
        <DialogTitle>Appointment Details</DialogTitle>

        <DialogContent dividers>

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
              {appointMentData?.type == "1" && (
                <LabSelect
                  sx={{ border: '1px solid #ccc', borderRadius: '10px', padding: '15px 10px' }}
                  value={appointMentData.lab}
                  onSelect={(id: string): void => {
                    console.log(id);
                    handleChange("lab", id);
                  }}
                />
              )}
            </>
          )}

          <TextField
            margin="dense"
            id="fee"
            label="Fee"
            type="fee"
            fullWidth
            variant="outlined"
            value={appointMentData?.fee}
            onChange={(e) => handleChange("fee", e.target.value)}

          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status">Status</InputLabel>
            <Select
              labelId="status"
              id="status"
              label="Status"
              value={appointMentData?.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              {
                Object.keys(APPOINTMENT_STATUS).map((key) => (
                  <MenuItem key={key} value={APPOINTMENT_STATUS[key as keyof typeof APPOINTMENT_STATUS]}>{key}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="paymentStatus">Payment Status</InputLabel>
            <Select
              labelId="paymentStatus"
              id="paymentStatus"
              label="Payment Status"
              value={appointMentData?.paymentStatus}
              onChange={(e) => handleChange("paymentStatus", e.target.value)}
            >
              {
                Object.keys(PAYMENT_STATUS).map((key) => (
                  <MenuItem key={key} value={PAYMENT_STATUS[key as keyof typeof PAYMENT_STATUS]}>{key}</MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <CompanySelect register={() => { }} value={appointMentData?.company} onChange={(value) => handleChange("company", value)} module={MODULES.APPOINTMENT} />

          <DepartmentSelect isMultiple={false} value={appointMentData.department} onChange={(value) => {
            handleChange("department", value)
          }} module={MODULES.APPOINTMENT} />

          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={appointMentData?.appointmentDate}
                onChange={(e: any) => {
                  handleChange("appointmentDate", e)
                  console.log(e)
                }
                }
                label="Appointment Date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: "dense",
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          <div className="time-container">
            <label>Start Time</label>
            <DatePicker2
              selected={appointMentData?.timeSlot.start ? moment(`${moment().format('DDMMYYYY')}${moment(appointMentData?.timeSlot.start, 'HHmm').format('HH:mm')}`, 'DDMMYYYYHHmm').toDate() : undefined}
              onChange={(date) => {
                handleChange("timeSlot.start", moment(date).format('HHmm'))
              }}
              showTimeSelectOnly
              showTimeSelect
              wrapperClassName={`w-100 react-datepicker-wrapper custom-date-picker-wrapper`}
              dateFormat="dd-MM-yyyy HH:mm"
              className="w-100 time-input"
              timeFormat="HH:mm"
              value={appointMentData?.timeSlot.start ? moment(appointMentData?.timeSlot.start, 'HHmm').format('hh:mm A') : 'Select Start Time'}
              timeInputLabel="Start Time"
              timeIntervals={15}
            />
          </div>
          <div className="time-container">
            <label>End Time</label>
            <DatePicker2
              selected={appointMentData?.timeSlot.end ? moment(`${moment().format('DDMMYYYY')}${moment(appointMentData?.timeSlot.end, 'HHmm').format('HH:mm')}`, 'DDMMYYYYHHmm').toDate() : undefined}
              onChange={(date) => { 
                handleChange("timeSlot.end", moment(date).format('HHmm'))
              }}
              showTimeSelectOnly
              showTimeSelect
              wrapperClassName={`w-100 react-datepicker-wrapper custom-date-picker-wrapper`}
              dateFormat="dd-MM-yyyy HH:mm"
              className="w-100 time-input"
              timeFormat="HH:mm"
              value={appointMentData?.timeSlot.end ? moment(appointMentData?.timeSlot.end, 'HHmm').format('hh:mm A') : 'Select End Time'}
              timeInputLabel="End Time"
              timeIntervals={15}
            />
          </div>

          {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              value={appointMentData?.timeSlot.start}
              onChange={(e: any) => {
                // const startTime = dayjs(e).format("HHmm");
                handleChange("timeSlot.start", e)
              }
              }
              label="Start Time"
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                },
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              value={appointMentData?.timeSlot.end}
              onChange={(e: any) => {   // 
                handleChange("timeSlot.end", e)
              }
              }
              label="End Time"
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                },
              }}
            />
          </LocalizationProvider> */}



        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal}>Cancel</Button>
          <Button onClick={handleSave} type="submit" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
