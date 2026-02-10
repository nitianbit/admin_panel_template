import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import { Stack, Switch, Box, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchInput from "../../components/SearchInput";
import InputLabel from "@mui/material/InputLabel";
import { Company } from "../../types/company";
import { useCompanyStore } from "../../services/company";
import { toast } from "react-toastify";

export default function CompanyDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {
  const { onCreate, detail, onUpdate } = useCompanyStore();

  const [comapnyData, setCompanyData] = React.useState<Company>({
    name: "",
    email: "",
    phone: null,
    contactPerson: "",
    noOfEmployees: 0,
    website: "",
    isActive: true,
    noOfUser: 0,
    codename: ""
  });

  const handleChange = (key: keyof Company, value: any) =>
    setCompanyData({ ...comapnyData, [key]: value });

  const handleClickOpen = () => toggleModal(true);
  const handleClose = () => toggleModal(false);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    const { name, contactPerson, email, phone, website, codename } = comapnyData;
    if (!name || !contactPerson || !email || !phone || !website || !codename) {
      toast.error("All fields are required");
      return;
    }
    if (comapnyData?._id) {
      onUpdate(comapnyData);
    } else {
      onCreate(comapnyData);
    }
    handleClose();
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const data = await detail(selectedId);
      setCompanyData(data?.data);
    } catch (error) {
      console.error("Failed to fetch company details", error);
    }
  };

  React.useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId);
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
          Add Company
        </Button>
      </Stack>

      <Drawer
        anchor="right"
        open={isModalOpen}
        onClose={handleClose}
      >
        <Box sx={{ width: { xs: '100%', sm: 500 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h6">Company Details</Typography>
            <IconButton onClick={handleClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
            <form onSubmit={handleSave} id="company-form">
              <Stack spacing={2}>
                <TextField
                  margin="dense"
                  id="name"
                  label="Company Name"
                  type="text"
                  required
                  fullWidth
                  variant="outlined"
                  value={comapnyData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />

                <TextField
                  margin="dense"
                  id="codename"
                  label="Codename"
                  type="text"
                  fullWidth
                  required
                  variant="outlined"
                  value={comapnyData.codename}
                  onChange={(e) => handleChange("codename", e.target.value)}
                />

                <TextField
                  margin="dense"
                  id="phone"
                  label="Phone Number"
                  type="text"
                  fullWidth
                  required
                  variant="outlined"
                  value={comapnyData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />

                <TextField
                  margin="dense"
                  label="Company Email"
                  type="email"
                  fullWidth
                  required
                  variant="outlined"
                  value={comapnyData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />

                <TextField
                  id="website"
                  margin="dense"
                  label="Company Website"
                  type="text"
                  fullWidth
                  required
                  variant="outlined"
                  value={comapnyData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                />

                <TextField
                  margin="dense"
                  fullWidth
                  required
                  label="Contact Person Name"
                  variant="outlined"
                  value={comapnyData.contactPerson}
                  onChange={(e) => handleChange("contactPerson", e.target.value)}
                />

                <TextField
                  margin="dense"
                  label="Number Of Users"
                  fullWidth
                  type="number"
                  required
                  variant="outlined"
                  value={comapnyData.noOfUser}
                  onChange={(e) => handleChange("noOfUser", e.target.value)}
                />

                <Box>
                  <InputLabel sx={{ mb: 1 }}>Is Active</InputLabel>
                  <Switch
                    checked={comapnyData.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                </Box>
              </Stack>
            </form>
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleClose} variant="outlined" color="error">Cancel</Button>
            <Button type="submit" form="company-form" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
}

