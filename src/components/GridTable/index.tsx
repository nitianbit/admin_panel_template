import React from "react";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TablePagination,
} from "@mui/material";
import { GridTableProps } from "../../types/gridTable";


const GridTable: React.FC<GridTableProps> = ({
  data,
  columns,
  spacing = 2,
  styles = {},
  currentPage = 1,
  totalPages = 1,
  onPageChange
}) => {
  return (
    <Grid container spacing={spacing} sx={{ marginleft: "10px", marginTop: "40px", ...styles }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="general table">
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index}>{col.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 &&
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} style={{ textDecoration: "none", color: "inherit" }}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[2]}
        component="div"
        count={totalPages}
        rowsPerPage={2}
        page={currentPage}
        onPageChange={onPageChange}
      />
    </Grid>
  );
};

export default GridTable;
