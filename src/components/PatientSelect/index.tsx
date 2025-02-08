import React from "react";
import GridDialog from "../Dialog/GridDialog";
import { Box, Typography } from "@mui/material";
import DoctorDetail from "../DoctorDetail";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { usePatientStore } from "../../services/patient";
import PatientDetail from "../PatientDetail";

interface Props {
  onSelect: (id: string) => void; // Callback when a doctor is selected
  value: string | null | undefined; // Selected doctor ID
  sx?: object; // Custom styling for the root container
}

export const PatientSelect: React.FC<Props> = ({ onSelect, value, sx={} }) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  const {
    data,
    totalPages,
    total,
    currentPage,
    isLoading,
    onPageChange,
    fetchGrid,
    onDelete,
  } = usePatientStore();

  const handleClose = () => setVisible(false);

  const handleSave = (ids: string[]) => {
    onSelect(ids.length ? ids[0] : "");
    setVisible(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          my: 1,
          justifyContent: "space-between",
          alignItems: "center",
          cursor:'pointer',
          ...sx, 
        }}
        onClick={() =>  setVisible(true)}
      >
        <Typography mr={2} color="rgba(0, 0, 0, 0.6)">
          Select Patient -
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {value ? <PatientDetail _id={value} /> : "Select Patient"}
          <PersonSearchIcon  sx={{ cursor: "pointer", ml: 2 }}/>
        </Box>
      </Box>
      <GridDialog
        open={visible}
        handleClose={handleClose}
        handleSave={handleSave}
        data={data}
        totalPages={totalPages}
        total={total}
        currentPage={currentPage}
        isLoading={isLoading}
        onPageChange={onPageChange}
        fetchGrid={fetchGrid}
        onDelete={onDelete}
        title="Patient"
        fullScreen={true}
        hideAction
      />
    </>
  );
};

export default PatientSelect;
