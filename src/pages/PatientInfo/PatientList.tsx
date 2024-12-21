import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Box,
  TablePagination
} from "@mui/material";
import { Link } from "react-router-dom";
import Chip from "@mui/material/Chip";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";
import AddPatientDialog from "./AddPatientDialog";
import { doGET } from "../../utils/HttpUtils";
import { DOCTORENDPOINTS } from "../../EndPoints/Doctor";
import { useAppContext } from "../../services/context/AppContext";
import { isError } from "../../utils/helper";

function PatientList({ data }: any) {

  const { success, error, userData} = useAppContext()
  const [patients, setPatients] = useState([]);
  const [searchedPatients, setSearchedPatients] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [filters, setFilters] = useState({
    doctor: null
  });

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

  const patientGrid = async () => {
    try {
      const response = await doGET(DOCTORENDPOINTS.getPatient(filters.doctor))


      if (response.status >= 200 && response.status < 300) {
        // setPatients([response.data.data])
        // setPatients((prevState: any) => [...prevState, ...response.data.data]);
      } else if (response.status >= 400 && response.status <= 500) {
        error(response.message)
      }
    } catch (e) {
      if (isError(e)) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    if (userData && !filters.doctor) {
      setFilters((prevState) => ({
        ...prevState,
        doctor: userData._id,
      }));
    }
  }, [userData]);
  
  useEffect(() => {
    if (filters.doctor) {
      patientGrid();
    }
  }, [filters.doctor]);
  
  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, patientList.length - page * rowsPerPage);

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
            patients={patients}
            setPatients={setPatients}
            handleChange={handleChange}
          />
          <Grid
            container
            spacing={2}
            sx={{ marginleft: "10px", marginTop: "40px" }}
          >
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="patient table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">#</TableCell>
                    <TableCell>FULL NAME</TableCell>
                    <TableCell>AGE</TableCell>
                    <TableCell>GENDER</TableCell>
                    <TableCell>ADDRESS</TableCell>
                    <TableCell>REFERRED BY DR.</TableCell>
                    <TableCell>ENTRY DATE</TableCell>
                    <TableCell>STATUS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? patientList.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                    : patientList
                  ).map((patient: any, index: any) => (
                    <TableRow
                      key={index}
                      component={Link}
                      to={`/patient-info/${patient.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <TableCell align="center">{patient.id}</TableCell>
                      <TableCell>{patient.fullName}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.address}</TableCell>
                      <TableCell>{patient.referredByDoctor}</TableCell>
                      <TableCell>{patient.dateOfEntry}</TableCell>
                      <TableCell>
                        <Chip
                          label={patient.status}
                          color={
                            patient.status === "In Treatment"
                              ? "success"
                              : "error"
                          }
                          sx={{ textTransform: "uppercase" }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={patientList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default PatientList;
