import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import AppointmentDialog from "./AppointmentDialog";
import { useAppointmentStore } from "../../services/appointment";
import GeneralTable from '../../components/GridTable/index'
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import Layout from "../../components/Layout";
import { useCompanyStore } from "../../services/company";

function Appointments() {
  const { data, totalPages, total, rows, currentPage, setFilters, isLoading, onPageChange, fetchGrid, onDelete, nextPage, prevPage } = useAppointmentStore();
  const { globalCompanyId } = useCompanyStore();

  useEffect(() => {
    if (globalCompanyId) {
      setFilters({ company: globalCompanyId })
    } else {
      fetchGrid()
    }
  }, [globalCompanyId])


  return (
    <Layout appBarTitle="Appointment">
      <Layout.Header component={AppointmentDialog} />
      <Layout.Body
        component={GeneralTable}
        props={{
          data,
          columns: COLUMNS,
          currentPage,
          totalPages,
          total,
          loading: isLoading,
          onPageChange,
          module: MODULES.DOCTOR,
          onDelete: (data: any) => onDelete(data._id)
        }}
      />


    </Layout>
  )


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

export default Appointments;
