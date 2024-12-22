import React, { useEffect, useState } from "react";
import { Grid, Box, TablePagination } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import AppointmentDialog from "./AppointmentDialog";
import { useAppointmentStore } from "../../services/appointment";
import GeneralTable from '../../components/GridTable/index'
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";

function Appointments() {
  const { data, totalPages, total,rows, currentPage, filters, isLoading, onPageChange, fetchGrid, onDelete, nextPage, prevPage } = useAppointmentStore();
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
          <AppointmentDialog />
          <Grid
            container
            spacing={2}
            sx={{ marginleft: "10px", marginTop: "40px" }}
          >
            {/* <AppointmentTableData appointments={appointments} />

            <TablePagination
              rowsPerPageOptions={[20]}
              component="div"
              count={totalPages}
              rowsPerPage={rows}
              page={currentPage}
              onPageChange={onPageChange}
            /> */}

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
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Appointments;
