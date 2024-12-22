// import React from "react";
// import {
//   Grid,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Avatar,
//   TablePagination,
// } from "@mui/material";
// import { GridTableProps } from "../../types/gridTable";


// const GridTable: React.FC<GridTableProps> = ({
//   data,
//   columns,
//   spacing = 2,
//   styles = {},
//   currentPage = 1,
//   totalPages = 1,
//   onPageChange
// }) => {
//   return (
//     <Grid container spacing={spacing} sx={{ marginleft: "10px", marginTop: "40px", ...styles }}>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="general table">
//           <TableHead>
//             <TableRow>
//               {columns.map((col, index) => (
//                 <TableCell key={index}>{col.header}</TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.length > 0 &&
//               data.map((row, rowIndex) => (
//                 <TableRow key={rowIndex} style={{ textDecoration: "none", color: "inherit" }}>
//                   {columns.map((col, colIndex) => (
//                     <TableCell key={colIndex}>
//                       {col.render ? col.render(row) : row[col.accessor]}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[20]}
//         component="div"
//         count={totalPages}
//         rowsPerPage={20}
//         page={currentPage-1}
//         onPageChange={onPageChange}
//       />
//     </Grid>
//   );
// };

// export default GridTable;



import React, { useState } from "react";
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
  Button,
} from "@mui/material";
import { GridTableProps } from "../../types/gridTable";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from "../ConfirmationDialog";

const GridTable: React.FC<GridTableProps> = ({
  data,
  columns,
  spacing = 2,
  styles = {},
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onDelete=(...args:any)=>{},
  onEdit=()=>{}
}) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState<{visible:boolean,data:boolean | null}>({
    visible:false,
    data:false
  });

  const handleOpenDialog = (data:any) => setDeleteConfirmation({ visible:true, data});
  const handleCloseDialog = () => setDeleteConfirmation({visible:false,data:null});

  const handleConfirm = () => {
    try {
      onDelete(deleteConfirmation.data);
      handleCloseDialog();
    } catch (error) {
      
    }
  };

  const onActionClick = (data: any) => {
    console.log("clicked", data)
    handleOpenDialog(data);
  }
  return (
    <>
    <Grid container spacing={spacing} sx={{ marginLeft: "10px", marginTop: "40px", ...styles }}>
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 650, position: "relative" }} aria-label="general table">
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index}>{col.header}</TableCell>
              ))}
              {/* Action Column Header */}
              <TableCell
                sx={{
                  position: "sticky",
                  right: 0,
                  backgroundColor: "#FAF9F6",
                  zIndex: 10,
                  boxShadow: "10px 10px",
                }}
              >
                ACTIONS
              </TableCell>
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
                  {/* Action Column */}
                  <TableCell
                    sx={{
                      position: "sticky",
                      right: 0,
                      backgroundColor: "#FAF9F6",
                      zIndex: 1,
                      boxShadow: "10px 10px",
                    }}
                  >

                    <Button sx={{ borderRadius: 0.5, }} variant="outlined" color="error" onClick={() => onActionClick(row)}>
                      <DeleteIcon />
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20]}
        component="div"
        count={totalPages}
        rowsPerPage={20}
        page={currentPage - 1}
        onPageChange={onPageChange}
      />
    </Grid>
      <ConfirmationDialog
        open={deleteConfirmation.visible}
        title="Delete Confirmation"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleConfirm}
        onCancel={handleCloseDialog}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default GridTable;
