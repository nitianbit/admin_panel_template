
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material"
import { useDoctorStore } from "../../services/doctors"
import { useEffect } from "react";
const DoctorTable = () => {

  const { data, totalPages, rows, onPageChange, currentPage, fetchGrid } = useDoctorStore();

  useEffect(() => {
    if (data?.length == 0) {
      fetchGrid()
    }
  }, [])

  return <Grid
    container
    spacing={2}
    sx={{ marginleft: "10px", marginTop: "40px" }}
  >
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="patient table">
        <TableHead>
          <TableRow>
            {/* <TableCell align="center">#</TableCell> */}
            <TableCell>DOCTOR NAME</TableCell>
            <TableCell>SPECIALIST</TableCell>
            <TableCell>EMAIL</TableCell>
            <TableCell>PHONE NO</TableCell>
            <TableCell>GENDER</TableCell>
            <TableCell>DEPARTMENT</TableCell>
            <TableCell>HOSPITAL</TableCell>
            <TableCell>FEE</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 &&
            data.map((doctor: any, index: number) => (
              <TableRow
                key={index}
                style={{ textDecoration: "none", color: "inherit" }}
              >

                <TableCell>{doctor.name}</TableCell>
                <TableCell>{doctor.specialization}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor?.phone ? doctor?.countryCode + doctor.phone : ""}</TableCell>
                <TableCell>{doctor.gender}</TableCell>
                <TableCell>{doctor?.departments ?? []?.join(',')}</TableCell>
                <TableCell>{doctor?.hospital?.join(',')}</TableCell>
                <TableCell>{doctor.fee}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={totalPages}
      rowsPerPage={rows}
      page={currentPage}
      onPageChange={onPageChange}
    />
  </Grid>
}

export default DoctorTable