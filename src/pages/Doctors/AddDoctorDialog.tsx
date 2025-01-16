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
import { useForm } from "react-hook-form";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDoctorStore } from "../../services/doctors";
import { Doctor } from "../../types/doctors";
import { MODULES } from "../../utils/constants";
import ServiceSelect from "../../components/DropDowns/ServiceSelect/ServiceSelect";
import DepartmentSelect from "../../components/DropDowns/DepartmentSelect/DepartmentSelect";



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddDoctorDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {
  const defaultData={
    name: "",
    gender: "",
    email: "",
    phone: 0,
    services: [],
    departments: [],
    description: "",
    role:[MODULES.DOCTOR]
    // specialization: ""
  }
  const { onCreate, detail, onUpdate } = useDoctorStore();
  const [doctorData, setDoctorData] = React.useState<Doctor>(defaultData)

  const handleChange = (key: any, value: any) => {
    setDoctorData({ ...doctorData, [key]: value });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Doctor>();

  const handleClickOpen = () => {
    toggleModal(true);
  };

  const handleClose = () => {
    toggleModal(false);
  };

  const onSubmit = () => {
    if (doctorData?._id) {
      onUpdate(doctorData);
    } else {
      onCreate(doctorData);
    }
    handleClose();
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const data = await detail(selectedId);
      reset(data?.data)
      setDoctorData(data?.data)
    } catch (error) {

    }
  }

  React.useEffect(() => {
    setDoctorData(defaultData)
    if (selectedId) {
      fetchDetail(selectedId)
    }
  }, [selectedId]);

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
          Add doctor
        </Button>
      </Stack>

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        sx={{ height: "100%" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add Dcotor</DialogTitle>

          <DialogContent dividers>
            <TextField
              margin="dense"
              id="name"
              label="Full Name"
              type="name"
              fullWidth
              variant="outlined"
              value={doctorData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="gender">Gender</InputLabel>
              <Select
                labelId="gender"
                id="gender"
                label="Gender"
                value={doctorData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
              </Select>
            </FormControl>



            {/* <CompanySelect value={doctorData.company} onChange={(value) => {
              handleChange("company", value)
            }} module={MODULES.DOCTOR} /> */}

            <ServiceSelect value={doctorData.services} onChange={(value) => {
              handleChange("services", value)
            }} module={MODULES.DOCTOR} />

            <DepartmentSelect value={doctorData.departments} onChange={(value) => {
              handleChange("departments", value)
            }} module={MODULES.DOCTOR} />

            <TextField
              margin="dense"
              id="phone"
              label="Phone no"
              type="phone"
              fullWidth
              variant="outlined"
              placeholder="0 123456789"
              value={doctorData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              placeholder="ex: test@test.com"
              value={doctorData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <TextField
              margin="dense"
              id="description"
              rows={4}
              label="Description"
              // type="description"
              fullWidth
              variant="outlined"
              placeholder=""
              value={doctorData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />

            {/* <TextField
              margin="dense"
              id="specialist"
              label="Specialist"
              type="specialist"
              fullWidth
              variant="outlined"
              placeholder="ex: Cardiologist, Dentist"
              value={doctorData.specialization}
              onChange={(e) => handleChange("specialization", e.target.value)}
            /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
