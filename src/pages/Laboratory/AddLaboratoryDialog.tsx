import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Box, Typography, Grid, IconButton, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import { useLaboratoryStore } from "../../services/laboratory";
import { Laboratory } from "../../types/laboratory";
import { MODULES } from "../../utils/constants";
import ServiceSelect from "../../components/DropDowns/ServiceSelect/ServiceSelect";
import DepartmentSelect from "../../components/DropDowns/DepartmentSelect/DepartmentSelect";
import CompanySelect from "../../components/DropDowns/CompanySelect";

export default function AddLaboratoryDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {

  const { onCreate, detail, onUpdate } = useLaboratoryStore();
  const [laboratoryData, setLaboratoryData] = React.useState<Laboratory>({
    name: "",
    email: "",
    phone: 0,
    company: "",
    address: "",
    hospital: "",
    services: [],
    departments: [],
    description: "",
    role: [MODULES.LABORATORY]
  })

  const handleChange = (key: any, value: any) => {
    setLaboratoryData({ ...laboratoryData, [key]: value });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Laboratory>();

  const handleClickOpen = () => {
    toggleModal(true);
  };

  const handleClose = () => {
    toggleModal(false);
    setLaboratoryData({
      name: "",
      email: "",
      phone: 0,
      // company: "",
      address: "",
      hospital: "",
      services: [],
      departments: [],
      description: ""
    })
  };

  const onSubmit = () => {

    const { hospital, _id, ...data } = laboratoryData
    const payload = { ...data, ...(hospital && { hospital }) }
    if (laboratoryData?._id) {
      onUpdate({ ...payload, _id: laboratoryData?._id });
    } else {
      onCreate(payload);
    }
    handleClose();
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const data = await detail(selectedId);
      reset(data?.data)
      setLaboratoryData(data?.data)
    } catch (error) {

    }
  }

  React.useEffect(() => {
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
          Add Laboratory
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
            <Typography variant="h6">Add Laboratory</Typography>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                {/* Laboratory Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 'bold' }}>Laboratory Information</Typography>
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
                    value={laboratoryData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
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
                    value={laboratoryData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
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
                    value={laboratoryData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1, fontWeight: 'bold' }}>Professional Details</Typography>
                </Grid>

                <Grid item xs={12}>
                  <CompanySelect value={laboratoryData.company} onChange={(value) => {
                    handleChange("company", value)
                  }} module={MODULES.LABORATORY} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <ServiceSelect value={laboratoryData.services} onChange={(value) => {
                    handleChange("services", value)
                  }} module={MODULES.LABORATORY} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DepartmentSelect value={laboratoryData.departments} onChange={(value) => {
                    handleChange("departments", value)
                  }} module={MODULES.LABORATORY} />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    id="description"
                    rows={4}
                    multiline
                    label="Description"
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder=""
                    value={laboratoryData.description}
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
