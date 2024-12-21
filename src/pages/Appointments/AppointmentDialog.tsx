import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Stack } from "@mui/material";
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
import { doGET, doPOST } from "../../utils/HttpUtils";
import { APPOITMENTENDPOINTS } from "../../EndPoints/Appointments";
import { useAppContext } from "../../services/context/AppContext";
import { isError } from "../../utils/helper";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import PatientDialog from "../../components/Dialog/PatientDialog";
import { DOCTORENDPOINTS } from "../../EndPoints/Doctor";

type FormValues = {
  fee: Number;
  status: string;
  paymentStatus: string;
  appointmentDate: any;
  timeSlot: {
    start: any,
    end: any,
  };
  patiendId?: string;
  doctor: string

};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppointmentDialog({
  getAppointments
}: any) {
  const { success, error, userData } = useAppContext();
  const [open, setOpen] = React.useState(false);
  const [patients, setPatients] = React.useState([])

  const [patientDialogOpen, setPatientDialogOpen] = React.useState(false);

  const [data, setData] = React.useState<FormValues>({
    fee: 0,
    status: "SCHD",
    paymentStatus: "PND",
    appointmentDate: "",
    timeSlot: {
      start: "",
      end: ""
    },
    patiendId: "",
    doctor: userData?._id
  })


  const handleChange = (key: any, value: any) => {
    setData({ ...data, [key]: value })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePatientDialogSave = () => {
    setPatientDialogOpen(false)
  }

  const handlePatientDialogClose = () => {
    setPatientDialogOpen(false)
  }

  const patientGrid = async () => {
    try {
      const response = await doGET(DOCTORENDPOINTS.getPatient(userData?._id))


      if (response.status >= 200 && response.status < 300) {
        setPatients(response.data.data)
        // setPatients((prevState: any) => [...prevState, ...response.data.data]);
      } else if (response.status >= 400 && response.status <= 500) {
        error(response.message)
      }
    } catch (e) {
      if (isError(e)) {
        console.log(e);
      }
    }
  }


  const handleSave = async () => {
    try {
      const date = dayjs(data.appointmentDate).format("YYYYMMDD");
      const startTime = dayjs(data.timeSlot.start).format("HHMM");
      const endTime = dayjs(data.timeSlot.end).format("HHMM");
      const response = await doPOST(APPOITMENTENDPOINTS.createAppointment, data);
      if (response.status >= 200 && response.status < 300) {
        getAppointments()
        handleClose()
        success("Appointment created successfully")
      } else if (response.status >= 400 && response.status <= 500) {
        error(response.message)
      }
    } catch (e) {
      if (isError(e)) {
        console.log(e);
        error(e.message)
      }
    }
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
      <PatientDialog
        patients={patients}
        open={patientDialogOpen}
        handleClose={handlePatientDialogClose}
        handleSave={handlePatientDialogSave}
      />

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
          <div onClick={() => {
            setPatientDialogOpen(true)
            patientGrid()
          }}>Select Patient</div>
          <TextField
            margin="dense"
            id="fee"
            label="Fee"
            type="fee"
            fullWidth
            variant="outlined"
            value={data?.fee}
            onChange={(e) => handleChange("fee", e.target.value)}

          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status">Status</InputLabel>
            <Select
              labelId="status"
              id="status"
              label="Status"
              value={data?.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <MenuItem value={"SCHD"}>Scheduled</MenuItem>
              <MenuItem value={"COMP"}>Completed</MenuItem>
              <MenuItem value={"CNCL"}>Cancel</MenuItem>
              <MenuItem value={"NOSH"}>No Show</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="paymentStatus">Payment Status</InputLabel>
            <Select
              labelId="paymentStatus"
              id="paymentStatus"
              label="Payment Status"
              value={data?.paymentStatus}
              onChange={(e) => handleChange("paymentStatus", e.target.value)}
            >
              <MenuItem value={"PD"}>Paid</MenuItem>
              <MenuItem value={"PND"}>Pending</MenuItem>
              <MenuItem value={"FLD"}>Failed</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={data?.appointmentDate}
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
              value={data?.timeSlot.start}
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
              value={data?.timeSlot.end}
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
