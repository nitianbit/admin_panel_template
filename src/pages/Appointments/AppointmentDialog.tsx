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

  const { onCreate, detail } = useAppointmentStore();
  const { globalCompanyId } = useCompanyStore();
  const { data: patientData, totalPages: patientTotalPages, total: patientTotal, currentPage: patientCurrentPage, isLoading: patientIsLoading, onPageChange: patientOnPageChange, fetchGrid: patientFetchtGrid, onDelete: patientOnDelete } = usePatientStore();
  const { data: doctorData, totalPages: doctorTotalPages, total: doctorTotal, currentPage: doctorCurrentPage, isLoading: doctorIsLoading, onPageChange: doctorOnPageChange, fetchGrid: doctorFetchtGrid, onDelete: doctorOnDelete } = useDoctorStore();
  const { userData } = useAppContext();


  const [patientDialogOpen, setPatientDialogOpen] = React.useState(false);
  const [doctorDialogOpen, setDoctorDialogOpen] = React.useState(false);

  const [appointMentData, setAppointMentData] = React.useState<Appointment>({
    fee: 0,
    status: "SCHD",
    paymentStatus: "PND",
    appointmentDate: "",
    timeSlot: {
      start: "",
      end: ""
    },
    doctor: userData?.role?.includes("doctors") ? userData?._id : "",
    patient: "",
    company: globalCompanyId ??""
  })

  const fetchData = async (id: string) => {
    try {
      const data = await detail(id)
      setAppointMentData({ ...data?.data, appointmentDate: dayjs(data?.data?.appointmentDate, "YYYYMMDD").toISOString() })
    } catch (error) {

    }
  }

  React.useEffect(() => {
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
    const startTime = dayjs(appointMentData.timeSlot.start).format("HHmm");
    const endTime = dayjs(appointMentData.timeSlot.end).format("HHmm");
    data.appointmentDate = date;
    data.timeSlot["start"] = startTime
    data.timeSlot["end"] = endTime;

    if (appointMentData.patient?.length === 0) return showError("Please select a patient")
    onCreate(appointMentData)
    toggleModal()
  }


  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <SearchInput />
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

      {userData?.role?.includes("admin") && <GridDialog
        open={doctorDialogOpen}
        handleClose={handleDoctorDialogClose}
        handleSave={handleDoctorDialogSave}
        data={doctorData}
        totalPages={doctorTotalPages}
        total={doctorTotal}
        currentPage={doctorCurrentPage}
        isLoading={doctorIsLoading}
        onPageChange={doctorOnPageChange}
        fetchGrid={doctorFetchtGrid}
        onDelete={doctorOnDelete}
        title="Doctor"
      />}

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
          <Box sx={{
            display: "flex",
            my: 1,
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Typography mr={2} color="rgba(0, 0, 0, 0.6)">
              Select Patient -
            </Typography>
            <Box sx={{
              display: "flex",
              alignItems: "center"
            }}>
              <PatientDetail _id={appointMentData?.patient} />
              <PersonSearchIcon sx={{ cursor: "pointer", ml: 2 }} onClick={() => {
                setPatientDialogOpen(true)
              }} />
            </Box>
          </Box>



          {userData.role.includes("admin") &&
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 1
            }}>
              <Typography mr={2} color="rgba(0, 0, 0, 0.6)">
                Select Doctor -
              </Typography>
              <Box sx={{
                display: "flex",
                alignItems: "center",
              }}>
                <DoctorDetail _id={appointMentData?.doctor} />
                <PersonSearchIcon sx={{ cursor: "pointer", ml: 2 }} onClick={() => {
                  setDoctorDialogOpen(true)
                }} />
              </Box>

            </Box>
          }

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

          <CompanySelect register={()=>{}} value={appointMentData?.company} onChange={(value) => handleChange("company", value)} module={MODULES.APPOINTMENT} />

          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={appointMentData?.appointmentDate}
                onChange={(e: any) => {
                  handleChange("appointmentDate", e)
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

          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          </LocalizationProvider>



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
