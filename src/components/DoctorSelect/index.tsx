import React from "react";
import GridDialog from "../Dialog/GridDialog";
import { useDoctorStore } from "../../services/doctors";
import { Box, Typography } from "@mui/material";
import DoctorDetail from "../DoctorDetail";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { DoctorFilters } from "../../types/doctors";

interface DoctorSelectProps {
  onSelect: (id: string) => void; // Callback when a doctor is selected
  value: string | null | undefined; // Selected doctor ID
  sx?: object; // Custom styling for the root container
}

export const DoctorSelect: React.FC<DoctorSelectProps> = ({ onSelect, value, sx={} }) => {
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
    setFilters
  } = useDoctorStore();

  const handleClose = () => setVisible(false);

  const handleSave = (ids: string[]) => {
    onSelect(ids.length ? ids[0] : "");
    setVisible(false);
  };

    const fetch=(filters?: DoctorFilters)=>{
      if(filters && Object.keys(filters).length){
        setFilters(filters)
      }else{
        setFilters({ });
      }
    }

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
          Select Doctor -
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {value ? <DoctorDetail _id={value} /> : "Select Doctor"}
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
        fetchGrid={fetch}
        onDelete={onDelete}
        title="Doctor"
        showSearch
      />
    </>
  );
};

export default DoctorSelect;
