import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react'
import { useForm } from "react-hook-form";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import { Service } from "../../types/services";
import { useServicestore } from "../../services/services";
import { useDepartmentStore } from "../../services/departments";
import { Department } from "../../types/departments";
import { SERVICE_TYPE } from "./constants";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddServiceDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
  const { onCreate, detail, onUpdate } = useServicestore();
  const { fetchGridAll: fetchAllDepartments, allData: departments } = useDepartmentStore();
  const [data, setData] = React.useState<Service>({
    name: "",
    department: '',
    type: ''
  })
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Service>();

  const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
  const handleClickOpen = () => toggleModal(true);
  const handleClose = () => toggleModal(false);

  const onSubmit = () => {
    if (data?._id) {
      onUpdate(data);
    } else {
      onCreate(data);
    }
    handleClose();
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const data = await detail(selectedId);
      reset(data?.data)
      setData(data?.data)
    } catch (error) {

    }
  }

  React.useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId)
    }
    fetchAllDepartments({});//TODO improve it make it fetch inside select component
  }, [selectedId]);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <SearchInput />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add Service
        </Button>
      </Stack>

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        sx={{ height: "100%" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add Service</DialogTitle>
          <DialogContent dividers>
            <TextField
              margin="dense"
              id="name"
              label="Service Name"
              type="name"
              fullWidth
              variant="outlined"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="service-label">Service Type</InputLabel>
              <Select
                labelId="service-label"
                value={data.type}
                label="Age"
                onChange={(e) => handleChange("type", e.target.value)}
              >
                {
                  Object.values(SERVICE_TYPE)?.map((item: string) => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel id="demo-simple-select-label">Department</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={data.department}
                label="Age"
                onChange={(e) => handleChange("department", e.target.value)}
              >
                {
                  departments?.map((item: Department) => (
                    <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>

          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </>
  )
}

export default AddServiceDialog