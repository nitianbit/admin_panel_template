import React, { useEffect, useState } from "react";
import {

  Box
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import AddPatientDialog from "./AddPatientDialog";
import { usePatientStore } from "../../services/patient";
import GeneralTable from "../../components/GridTable";
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import Layout from "../../components/Layout";

function PatientList({ }: any) {

  const { data, totalPages, rows, total, currentPage, filters, isLoading, onPageChange, fetchGrid, onCreate, onDelete, nextPage, prevPage } = usePatientStore();
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
      <Layout appBarTitle="Patient">
        <Layout.Header component={AddPatientDialog} />
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
            create={onCreate}
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

export default PatientList;
