import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material"
import { Link } from "react-router-dom"
import { usePatientStore } from "../../services/patient";
import { useEffect } from "react";

const PatientTable = ({
  selectedIds ,
  setSelectedIds,
}: any) => {
  const { data, totalPages, rows, currentPage, filters, isLoading, fetchGrid, create, setFilters, nextPage, prevPage, onPageChange } = usePatientStore();

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId: any) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedIds = data.map((patient: any) => patient._id);
      setSelectedIds(newSelectedIds);
    } else {
      setSelectedIds([]);
    }
  };


  useEffect(() => {
    if (data.length == 0) {
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
            {selectedIds && <TableCell align="center"><input type="checkbox" onChange={handleSelectAll} /></TableCell>}
            <TableCell>NAME</TableCell>
            <TableCell>AGE</TableCell>
            <TableCell>GENDER</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>ADDRESS</TableCell>
            <TableCell>COMPANY</TableCell>
            <TableCell>ENTRY DATE</TableCell>
            {/* <TableCell>STATUS</TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((patient: any, index: any) => (
            <TableRow
              key={index}
              // component={Link}
              // to={`/patient-info/${patient?._id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {selectedIds && <TableCell><input type="checkbox" checked={selectedIds?.includes(patient?._id)} onChange={(e) => {
                handleSelect(patient._id)
              }} /></TableCell>}
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.age}</TableCell>
              <TableCell>{patient.gender}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.address}</TableCell>
              <TableCell>{patient.company}</TableCell>
              <TableCell>{patient.dateOfEntry}</TableCell>
              {/* <TableCell>
                        <Chip
                          label={patient.status}
                          color={
                            patient.status === "In Treatment"
                              ? "success"
                              : "error"
                          }
                          sx={{ textTransform: "uppercase" }}
                        />
                      </TableCell> */}
            </TableRow>
          ))}
          {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )} */}
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
    //   onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Grid>
}

export default PatientTable;