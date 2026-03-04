import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import _ from "lodash";
import React from "react";
import { useForm } from "react-hook-form";
import SearchInput from "../../components/SearchInput";
import { useVendorStore } from "../../services/vendors";
import { Vendor } from "../../types/vendors";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValue = {
  name: "",
  company: [],
  external: true
}

const AddVendorDialog = ({ isModalOpen, toggleModal, selectedId }: any) => {
  const { onCreate, detail, onUpdate } = useVendorStore();
  const [data, setData] = React.useState<Vendor>(defaultValue);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<Vendor>();

  const handleChange = (key: any, value: any) => setData(prev => ({ ...prev, [key]: value }));
  const handleClickOpen = () => toggleModal(true);
  const handleClose = () => toggleModal(false);

  const onSubmit = async () => {
    try {

      let response: Vendor | null = null;
      const payload: any = _.cloneDeep(data);

      if (!payload?.company?.length) {
        delete payload.company
      }

      if (data?._id) {
        response = await onUpdate(payload);
      } else {
        response = await onCreate(payload);
      }



      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDetail = async (selectedId: string) => {
    try {
      const res = await detail(selectedId);
      const data = res?.data;
      reset(data);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    setData(defaultValue);
    if (selectedId) {
      fetchDetail(selectedId);
    }
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
          Add Vendor
        </Button>
      </Stack>

      <Dialog
        open={isModalOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add Vendor</DialogTitle>
          <DialogContent dividers>
            <TextField
              margin="dense"
              id="name"
              label="Full Name"
              type="name"
              fullWidth
              variant="outlined"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={data.external}
                  onChange={(e) => handleChange("external", e.target.checked)}
                  name="external"
                />
              }
              label="External Package"
            />



          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddVendorDialog;
