import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Stack, Typography } from "@mui/material";
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
import { APPOINTMENT_STATUS, PAYMENT_STATUS } from "../../utils/constants";
import PatientDetail from "../../components/PatientDetail";
import DoctorDetail from "../../components/DoctorDetail";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppointmentDialog({
}: any) {

  const { onCreate } = useAppointmentStore();
  const { data: patientData, totalPages: patientTotalPages, total: patientTotal, currentPage: patientCurrentPage, isLoading: patientIsLoading, onPageChange: patientOnPageChange, fetchGrid: patientFetchtGrid, onDelete: patientOnDelete } = usePatientStore();
  const { data: doctorData, totalPages: doctorTotalPages, total: doctorTotal, currentPage: doctorCurrentPage, isLoading: doctorIsLoading, onPageChange: doctorOnPageChange, fetchGrid: doctorFetchtGrid, onDelete: doctorOnDelete } = useDoctorStore();
  const { userData } = useAppContext();
  const [open, setOpen] = React.useState(false);


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
  })


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


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePatientDialogSave = (ids: any) => {
    setPatientDialogOpen(false)
    appointMentData.patient = ids
  }


  const handleDoctorDialogSave = (ids: any) => {
    setDoctorDialogOpen(false)
    appointMentData.doctor = ids
  }

  const handlePatientDialogClose = () => {
    setPatientDialogOpen(false)
  }


  const handleDoctorDialogClose = () => {
    setDoctorDialogOpen(false)
  }

  const handleSave = async () => {

    const date = dayjs(appointMentData.appointmentDate).format("YYYYMMDD");
    const startTime = dayjs(appointMentData.timeSlot.start).format("HHMM");
    const endTime = dayjs(appointMentData.timeSlot.end).format("HHMM");
    appointMentData.appointmentDate = date;
    appointMentData.timeSlot["start"] = startTime
    appointMentData.timeSlot["end"] = endTime;

    if (appointMentData.patient?.length === 0) return showError("Please select a patient")


    onCreate(appointMentData)
    handleClose()
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
          onClick={handleClickOpen}
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
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        sx={{ height: "100%" }}
      >
        <DialogTitle>Appointment Details</DialogTitle>

        <DialogContent dividers>
          <Typography onClick={() => {
            setPatientDialogOpen(true)
          }}>
            Select Patient  <PatientDetail _id={appointMentData?.patient} />
          </Typography>


          {userData.role.includes("admin") && <Typography onClick={() => {
            setDoctorDialogOpen(true)
          }}>
            Select Doctor  <DoctorDetail _id={appointMentData?.doctor} />
            </Typography>}

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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} type="submit" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
