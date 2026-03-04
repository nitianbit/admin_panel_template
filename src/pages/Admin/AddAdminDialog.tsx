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
import { useAdminStore } from "../../services/admin";
import { Admin } from "../../types/admin";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { MODULES } from "../../utils/constants";



const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddAdminDialog({
  isModalOpen,
  toggleModal,
  selectedId
}: any) {

  const { onCreate, detail, onUpdate } = useAdminStore();
  const [adminData, setAdminData] = React.useState<Admin>({
    name: "",
    email: "",
    phone: 0,
    company: "",
    role:["admin"],
    address: "",
  })

  const handleChange = (key: any, value: any) => {
    setAdminData({ ...adminData, [key]: value });
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<Admin>();

  const handleClickOpen = () => {
    toggleModal(true);
  };

  const handleClose = () => {
    toggleModal(false);
    setAdminData({
      name: "",
      email: "",
      phone: 0,
      company: "",
      address: "",
      _id: ""
    })
  };

  const onSubmit = () => {

    if (adminData?._id) {
      onUpdate(adminData);
    } else {
      onCreate(adminData);
    }
    handleClose();
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const data = await detail(selectedId);
      reset(data?.data)
      setAdminData(data?.data)
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
          Add Admin
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
              required
              variant="outlined"
              value={adminData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />


            <CompanySelect value={adminData.company} onChange={(value) => {
              handleChange("company", value)
            }} module={MODULES.ADMIN} />

            <TextField
              margin="dense"
              id="phone"
              label="Phone no"
              type="phone"
              fullWidth
              required
              variant="outlined"
              placeholder="0 123456789"
              value={adminData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <TextField
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              required
              variant="outlined"
              placeholder="ex: test@test.com"
              value={adminData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {/* <Select
              labelId="role"
              id="role"
              label="Role"
              value={adminData.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <MenuItem value={"admin"}>Admin</MenuItem>
              <MenuItem value={"supervisor"}>Supervisor</MenuItem>
            </Select> */}
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
