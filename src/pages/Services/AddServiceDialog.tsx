import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React from 'react'
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField
} from "@mui/material";
import SearchInput from "../../components/SearchInput";
import AddIcon from "@mui/icons-material/Add";
import { Service } from "../../types/services";
import { useServicestore } from "../../services/services";
import { Department } from "../../types/departments";
import { SERVICE_TYPE } from "./constants";
import CompanySelect from "../../components/DropDowns/CompanySelect";
import { MODULES } from "../../utils/constants";
import { showError } from "../../services/toaster";
import { doGET } from "../../utils/HttpUtils";
import { ENDPOINTS } from "../../services/api/constants";

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

  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [data, setData] = React.useState<Service>({
    name: "",
    department: "",
    type: "",
    company: ""
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Service>();

  // Fetch departments filtered by company directly
  const fetchDepartmentsByCompany = async (companyId: string) => {
    if (!companyId) return [];

    const queryParams = new URLSearchParams({ company: companyId, rows: '-1' });
    const apiUrl = `${ENDPOINTS.grid('departments')}?${queryParams.toString()}`;

    try {
      const response = await doGET(apiUrl);
      if (response.status >= 200 && response.status < 400) {
        return response.data.data.rows;
      }
    } catch (error) {
      showError("Failed to fetch departments");
    }
    return [];
  };

  const handleChange = async (key: any, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));

    if (key === "company") {
      setDepartments([]); // clear before fetching new ones
      const depts = await fetchDepartmentsByCompany(value);
      setDepartments(depts);
      setData(prev => ({ ...prev, department: "" })); // reset department selection
    }
  };

  const handleClickOpen = () => toggleModal(true);
  const handleClose = () => toggleModal(false);

  const onSubmit = async () => {
    if (!data.company) {
      return showError("Please select a company");
    }

    if (data?._id) {
      await onUpdate(data);
    } else {
      await onCreate(data);
    }
    handleClose();
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const response = await detail(selectedId);
      const fetchedData = response?.data;
      reset(fetchedData);
      setData(fetchedData);
      if (fetchedData?.company) {
        const depts = await fetchDepartmentsByCompany(fetchedData.company);
        setDepartments(depts);
      }
    } catch (error) { }
  }

  React.useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId);
    }
  }, [selectedId]);

  // Clear form when opening new modal (adding new service)
  React.useEffect(() => {
    if (isModalOpen && !selectedId) {
      reset({
        name: "",
        department: "",
        type: "",
        company: ""
      });
      setData({
        name: "",
        department: "",
        type: "",
        company: ""
      });
      setDepartments([]);
    }
  }, [isModalOpen, selectedId, reset]);

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
              type="text"
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
                label="Service Type"
                onChange={(e) => handleChange("type", e.target.value)}
              >
                {Object.values(SERVICE_TYPE)?.map((item: string) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <CompanySelect
              value={data.company}
              onChange={(value) => handleChange("company", value)}
              module={MODULES.SERVICES}
            />

            <FormControl fullWidth margin="dense" disabled={!data.company}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department-select"
                value={data.department}
                label="Department"
                onChange={(e) => handleChange("department", e.target.value)}
              >
                {departments.map((item: Department) => (
                  <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                ))}
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

export default AddServiceDialog;
