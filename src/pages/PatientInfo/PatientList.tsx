import React, { useEffect, useState } from "react";
import {

  Box
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import AddPatientDialog from "./AddPatientDialog";
import { usePatientStore } from "../../services/patient";
import PatientTable from "./PatientTable";
import GeneralTable from "../../components/GridTable";
import { COLUMNS } from "./constants";

function PatientList({ }: any) {

  const { data, totalPages, rows, currentPage, filters, isLoading, onPageChange, fetchGrid, create, setFilters, nextPage, prevPage } = usePatientStore();
  const [patients, setPatients] = useState([]);
  const [searchedPatients, setSearchedPatients] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);


  const handleChange = (e: any) => {
    const data: any = patients.filter((item: any) =>
      item.fullName.toLowerCase().match(e.target.value)
    );
    setSearchedPatients(data);
    setPage(0); // Reset page to the first page when searching
  };

  const patientList = searchedPatients.length > 0 ? searchedPatients : patients;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to the first page when changing rows per page
  };


  // const emptyRows =
  //   rowsPerPage -
  //   Math.min(rowsPerPage, patientList.length - page * rowsPerPage);

   React.useEffect(() => {
      fetchGrid()
    }, [])
  

  return (
    <Box sx={{ display: "flex" }}>
      <Appbar appBarTitle="Patient List" />
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
          <AddPatientDialog
            create={create}
            fetchGrid={fetchGrid}
            patients={patients}
            setPatients={setPatients}
            handleChange={handleChange}
          />
          <GeneralTable
            data={data}
            columns={COLUMNS}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={isLoading}
            onPageChange={onPageChange}
          />
        </Container>
      </Box>
    </Box>
  );
}

export default PatientList;
