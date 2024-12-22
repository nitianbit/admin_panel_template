import React, { useEffect, useState } from "react";
import { Grid, Box, TablePagination } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import AppointmentDialog from "./AppointmentDialog";
import AppointmentTableData from "./AppointmentTableData";
import { useAppContext } from "../../services/context/AppContext";
import { doGET } from "../../utils/HttpUtils";
import { APPOITMENTENDPOINTS } from "../../EndPoints/Appointments";
import { isError } from "../../utils/helper";
import { useAppointmentStore } from "../../services/appointment";

function Appointments() {
  const { data, totalPages, rows, currentPage, filters, isLoading, onPageChange, fetchGrid, setFilters, nextPage, prevPage } = useAppointmentStore();
  const [appointments, setAppointments] = useState([]);


  useEffect(() => {
    fetchGrid()
  }, [])


  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Appointment" />
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
          <AppointmentDialog
            appointments={appointments}
            setAppointments={setAppointments}
            getAppointments={fetchGrid}
          />
          <Grid
            container
            spacing={2}
            sx={{ marginleft: "10px", marginTop: "40px" }}
          >
            <AppointmentTableData appointments={appointments} />

            <TablePagination
              rowsPerPageOptions={[20]}
              component="div"
              count={totalPages}
              rowsPerPage={rows}
              page={currentPage}
              onPageChange={onPageChange}
            />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Appointments;
