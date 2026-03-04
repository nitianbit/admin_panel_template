import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Box, Typography, Grid, IconButton, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
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
import CompanySelect from "../../components/DropDowns/CompanySelect";

export default function AddDoctorDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {
  const defaultData = {
    name: "",
    gender: "",
    email: "",
    phone: 0,
    services: [],
    departments: [],
    description: "",
    role: [MODULES.DOCTOR],
    degree: '',
    specialization: ""
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

      <Drawer
        anchor="right"
        open={isModalOpen}
        onClose={handleClose}
      >
        <Box sx={{ width: { xs: '100%', sm: 600 }, p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Add Doctor</Typography>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/* Personal Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Personal Information</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    id="name"
                    label="Full Name"
                    type="name"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={doctorData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense" size="small">
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
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    id="phone"
                    label="Phone no"
                    type="phone"
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="0 123456789"
                    value={doctorData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="ex: test@test.com"
                    value={doctorData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Professional Details</Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    id="degree"
                    label="Degree"
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="ex: MBBS, MD"
                    value={doctorData.degree}
                    onChange={(e) => handleChange("degree", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    margin="dense"
                    id="specialization"
                    label="Specialization"
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="ex: Cardiologist"
                    value={doctorData.specialization}
                    onChange={(e) => handleChange("specialization", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CompanySelect value={doctorData.company} onChange={(value) => {
                    handleChange("company", value)
                  }} module={MODULES.DOCTOR} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <ServiceSelect value={doctorData.services} onChange={(value) => {
                    handleChange("services", value)
                  }} module={MODULES.DOCTOR} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DepartmentSelect value={doctorData.departments} onChange={(value) => {
                    handleChange("departments", value)
                  }} module={MODULES.DOCTOR} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    id="description"
                    rows={2}
                    multiline
                    label="Description"
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={doctorData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                  />
                </Grid>
              </Grid>
            </form>
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}
