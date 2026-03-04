import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import { useForm } from "react-hook-form";
import { MARKETING } from "../../types/marketing";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { MODULES } from "../../utils/constants";
import { useMARKETINGStore } from "../../services/marketing";
import { showError } from "../../services/toaster";

export default function AddMARKETINGDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {

  const { onCreate, detail, onUpdate } = useMARKETINGStore();
  const [hRData, setMARKETINGData] = React.useState<MARKETING>({
    name: "",
    email: "",
    role: ["marketing"],
    phone: "",
    company: "",
  })

  const handleChange = (key: any, value: any) => {
    setMARKETINGData({ ...hRData, [key]: value });
  }

  const {
    handleSubmit,
    reset
  } = useForm<MARKETING>();

  const handleClickOpen = () => {
    toggleModal(true);
  };

  const handleClose = () => {
    toggleModal(false);
    setMARKETINGData({
      name: "",
      email: "",
      phone: "",
      role: ["marketing"],
      company: ""
    })
  };

  const onSubmit = () => {
    if (!hRData.company || !hRData.email || !hRData.name || !hRData.phone) {
      return showError("All fields are required")
    }
    if (hRData?._id) {
      onUpdate(hRData);
    } else {
      onCreate(hRData);
    }
    handleClose();
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const data = await detail(selectedId);
      reset(data?.data)
      setMARKETINGData(data?.data)
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
          Add MARKETING
        </Button>
      </Stack>

      <Drawer
        anchor="right"
        open={isModalOpen}
        onClose={handleClose}
      >
        <Box sx={{ width: { xs: '100%', sm: 400 }, p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Add MARKETING</Typography>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <TextField
                  margin="dense"
                  id="name"
                  label="Full Name"
                  type="name"
                  fullWidth
                  required
                  size="small"
                  variant="outlined"
                  value={hRData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <CompanySelect value={hRData.company} onChange={(value) => {
                  handleChange("company", value)
                }} module={MODULES.MARKETING} />

                <TextField
                  margin="dense"
                  id="phone"
                  required
                  label="Phone no"
                  type="phone"
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="0 123456789"
                  value={hRData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                <TextField
                  margin="dense"
                  id="email"
                  required
                  label="Email Address"
                  type="email"
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder="ex: test@test.com"
                  value={hRData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </Stack>
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
