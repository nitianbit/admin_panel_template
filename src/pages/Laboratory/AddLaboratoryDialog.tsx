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
import { useLaboratoryStore } from "../../services/laboratory";
import { Laboratory } from "../../types/laboratory";
import CompanySelect from "../../components/DropDowns/CompanySelect";
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
    description:""
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
      company: "",
      address: "",
      hospital: "",
      services: [],
      departments: [],
      _id: "",
      description:""
    })
  };

  const onSubmit = () => {

    if (laboratoryData?._id) {
      onUpdate(laboratoryData);
    } else {
      onCreate(laboratoryData);
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
              value={laboratoryData.name}
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
              value={laboratoryData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />


            <CompanySelect value={laboratoryData.company} onChange={(value) => {
              handleChange("company", value)
            }} module={MODULES.LABORATORY} />

            <ServiceSelect value={laboratoryData.services} onChange={(value) => {
              handleChange("services", value)
            }} module={MODULES.LABORATORY} />

            <DepartmentSelect value={laboratoryData.departments} onChange={(value) => {
              handleChange("departments", value)
            }} module={MODULES.LABORATORY} />

            <TextField
              margin="dense"
              id="phone"
              label="Phone no"
              type="phone"
              fullWidth
              variant="outlined"
              placeholder="0 123456789"
              value={laboratoryData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
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
              value={laboratoryData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
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
