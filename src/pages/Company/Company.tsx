import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import CompanyDialog from "./CompanyDialog";
import GeneralTable from '../../components/GridTable/index'
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import { useCompanyStore } from "../../services/company";

function Company() {
  const { data, totalPages, total,rows, currentPage, filters, isLoading, onPageChange, fetchGrid, onDelete, nextPage, prevPage } = useCompanyStore();
  useEffect(() => {
    fetchGrid()
  }, [])


  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Company" />
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
          <CompanyDialog />
          <Grid
            container
            spacing={2}
            sx={{ marginleft: "10px", marginTop: "40px" }}
          >
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

export default Company;
