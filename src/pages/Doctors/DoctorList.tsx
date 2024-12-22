import * as React from "react";
import Paper from "@mui/material/Paper";
import Appbar from "../../components/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Avatar, Grid, Box } from "@mui/material";
import AddDoctorDialog from "./AddDoctorDialog";
import { useDoctorStore } from "../../services/doctors";
import GeneralTable from "../../components/GridTable";
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";

export default function DoctorList() {
  const { data, totalPages, currentPage,total, filters, isLoading, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useDoctorStore();


  React.useEffect(() => {
    fetchGrid()
  }, [])


  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Doctor List" />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto"
        }}
      >
        <Toolbar />

        <Container sx={{ mt: 4, mb: 4 }}>
          <AddDoctorDialog />
          <GeneralTable
            data={data}
            columns={COLUMNS}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            loading={isLoading}
            onPageChange={onPageChange}
            module={MODULES.DOCTOR}
            onDelete={(data: any) => {
              onDelete(data._id)
            }}
          />
        </Container>
      </Box>
    </Box>
  );
}
