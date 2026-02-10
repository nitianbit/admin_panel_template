import { Button, Drawer, Box, Stack, Typography, IconButton, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close";
import { Patient } from "../../types/patient";
import { useForm } from "react-hook-form";
import React from "react";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { MODULES } from "../../utils/constants";
import { usePatientStore } from "../../services/patient";
import { useAppContext } from "../../services/context/AppContext";
import { useCompanyStore } from "../../services/company";

interface AddPatientDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedId?: string;
}

const AddSinglePatientContent: React.FC<AddPatientDialogProps> = ({ open, setOpen, selectedId }) => {
  const { userData } = useAppContext();
  const { detail, onUpdate, fetchGrid, onCreate: create } = usePatientStore();
  const { globalCompanyId } = useCompanyStore();

  const defaultData: Patient = {
    name: "",
    surname: "",
    employId: "",
    dob: "",
    gender: "",
    company: userData.role.includes("hr") && globalCompanyId ? globalCompanyId : "",
    phone: "",
    address: "",
    age: "",
    email: "",
    height: undefined,
    weight: undefined,
    isVerified: true,
  };

  const [patientData, setPatientData] = React.useState<Patient>(defaultData);

  const {
    handleSubmit,
    reset,
  } = useForm<Patient>();

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (key: keyof Patient, value: any) => {
    setPatientData({ ...patientData, [key]: value });
  };

  const onSubmit = () => {
    if (patientData?._id) {
      onUpdate(patientData);
    } else {
      create(patientData);
    }
    handleClose();
    reset();
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const data = await detail(selectedId);
      reset(data?.data);
      setPatientData(data?.data);
    } catch (error) { }
  };

  React.useEffect(() => {
    setPatientData(defaultData);
    if (selectedId) {
      fetchDetail(selectedId);
    }
  }, [selectedId]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
    >
      <Box sx={{ width: { xs: '100%', sm: 500 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">{patientData._id ? "Edit" : "Add"} Patient</Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                margin="dense"
                label="Full Name"
                fullWidth
                variant="outlined"
                value={patientData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Surname"
                fullWidth
                variant="outlined"
                value={patientData.surname}
                onChange={(e) => handleChange("surname", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Employee ID"
                fullWidth
                variant="outlined"
                value={patientData.employId}
                onChange={(e) => handleChange("employId", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Date of Birth"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                value={patientData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel id="gender">Gender</InputLabel>
                <Select
                  labelId="gender"
                  label="Gender"
                  value={patientData.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <MenuItem value={"Male"}>Male</MenuItem>
                  <MenuItem value={"Female"}>Female</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                </Select>
              </FormControl>

              <CompanySelect
                disabled={userData.role.includes("hr")}
                value={patientData.company}
                onChange={(value) => handleChange("company", value)}
                module={MODULES.PATIENTS}
              />

              <TextField
                margin="dense"
                label="Phone No"
                fullWidth
                variant="outlined"
                value={patientData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={patientData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Address"
                fullWidth
                variant="outlined"
                value={patientData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Age"
                fullWidth
                variant="outlined"
                value={patientData.age}
                onChange={(e) => handleChange("age", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Height (in cm)"
                fullWidth
                variant="outlined"
                value={String(patientData.height ?? "")}
                onChange={(e) => handleChange("height", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Weight (in Kg)"
                fullWidth
                variant="outlined"
                value={String(patientData.weight ?? "")}
                onChange={(e) => handleChange("weight", e.target.value)}
              />
            </Stack>
          </form>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddSinglePatientContent;
