import * as React from "react";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchInput from "../../components/SearchInput";
import AddSinglePatientContent from "./AddSinglePatientContent";
import AddBulkUpload from "./AddBulkUploadContent";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddPatientDialog({
  create,
  handleChange,
  fetchGrid,
  isModalOpen,
  toggleModal
}: any) {
  const [bulkOpen, setbulkOpen] = React.useState(false);

  
  const handleClickOpen = () => {
    toggleModal(true);
  };

  const handleBulkClickOpen = () => {
    setbulkOpen(true);
  };


  return (
    <div>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <SearchInput handleChange={handleChange} />
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleBulkClickOpen}
            sx={{ mr: 1 }}
          >
            Add Bulk Patient
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Patient
          </Button>
        </Box>

        <AddSinglePatientContent open={isModalOpen} setOpen={toggleModal} create={create} fetchGrid={fetchGrid} />
        <AddBulkUpload open={bulkOpen} setOpen={setbulkOpen}/>
      </Stack>


    </div>
  );
}
