import React from "react";
import GridDialog from "../Dialog/GridDialog";
import { useDoctorStore } from "../../services/doctors";
import { Box, Typography } from "@mui/material";
import DoctorDetail from "../DoctorDetail";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useLaboratoryStore } from "../../services/laboratory";
import LabDetail from "../LabDetail";

interface SelectProps {
  onSelect: (id: string) => void; // Callback when a doctor is selected
  value: string | null | undefined; // Selected doctor ID
  sx?: object; // Custom styling for the root container
}

export const LabSelect: React.FC<SelectProps> = ({ onSelect, value, sx={} }) => {
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
  } = useLaboratoryStore();

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
          Select Lab -
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {value ? <LabDetail _id={value} /> : "Select Lab"}
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
        title="Laboratory"
      />
    </>
  );
};

export default LabSelect;
