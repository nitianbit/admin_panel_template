import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Stack, Switch } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchInput from "../../components/SearchInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Company } from "../../types/company";
import { useCompanyStore } from "../../services/company";
import { useForm } from "react-hook-form";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CompanyDialog({
}: any) {

  const { onCreate } = useCompanyStore();
  const [open, setOpen] = React.useState(false);

  const [comapnyData, setCompanyData] = React.useState<Company>({
    name: "",
    email: "",
    phone: "",
    contactPerson: "",
    noOfEmployees: 0,
    website: "",
    isActive: true
  })


  const handleChange = (key: any, value: any) => {
    setCompanyData({ ...comapnyData, [key]: value });
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {

    onCreate(comapnyData)
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
          Add Company
        </Button>
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        sx={{ height: "100%" }}
      >

        <form onSubmit={handleSave}>
          <DialogTitle>Company Details</DialogTitle>

          <DialogContent dividers>
            <TextField
              margin="dense"
              id="name"
              label="Company Name"
              type="name"
              required
              fullWidth
              variant="outlined"
              value={comapnyData?.name}
              onChange={(e) => handleChange("name", e.target.value)}

            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              placeholder="ex: test@test.com"
              value={comapnyData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />

            <TextField
              margin="dense"
              id="phone"
              label="Phone no"
              type="phone"
              fullWidth
              variant="outlined"
              placeholder="0 123456789"
              value={comapnyData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />


            <TextField
              id="contactPersonv"
              margin="dense"
              type="website"
              fullWidth
              required
              label="Contact person"
              variant="outlined"
              value={comapnyData?.contactPerson}
              onChange={(e) => handleChange("contactPersonv", e.target.value)}
            />


            <TextField
              id="website"
              margin="dense"
              type="website"
              fullWidth
              required
              label="Company Wenbsite"
              variant="outlined"
              value={comapnyData?.website}
              onChange={(e) => handleChange("website", e.target.value)}
            >

              <TextField
                margin="dense"
                id="noOfEmployees"
                label="No Of Employees"
                type="phone"
                fullWidth
                variant="outlined"
                placeholder="0"
                value={comapnyData.noOfEmployees}
                onChange={(e) => handleChange("noOfEmployees", e.target.value)}
              />

            </TextField>
            {/* <FormControl fullWidth margin="dense"> */}
            <InputLabel id="paymentStatus">Is Active</InputLabel>
            <Switch
              checked={comapnyData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            {/* </FormControl> */}
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
