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
  Checkbox,
} from "@mui/material";
import { GridTableProps } from "../../types/gridTable";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from "../ConfirmationDialog";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedIcon from '@mui/icons-material/Verified';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { MODULES } from "../../utils/constants";
import { useAppContext } from "../../services/context/AppContext";
import { isAdminOrSuperVisorOrHR } from "../../utils/helper";

const GridTable: React.FC<GridTableProps> = ({
  data,
  columns,
  spacing = 2,
  styles = {},
  currentPage = 1,
  totalPages = 1,
  total,
  onPageChange,
  onDelete = (...args: any) => { },
  selectedIds,
  setSelectedIds,
  toggleModal,
  module,
  rows=2,
  onUpdate = (...args: any) => { },
  hideAction=false
}) => {
   const [deleteConfirmation, setDeleteConfirmation] = useState<{ visible: boolean, data: any | null,type:string | null }>({
    visible: false,
    data: null,
    type: null
  });
 
  const handleOpenDialog = (data: any,type="Delete") => setDeleteConfirmation({ visible: true, data ,type});
  const handleCloseDialog = () => setDeleteConfirmation({ visible: false, data: null,type:null });
  const {userData}=useAppContext();

  const handleConfirm = () => {
    try {
      if(deleteConfirmation.type=="Delete"){
        onDelete(deleteConfirmation.data);
      }else if(deleteConfirmation.type=="Approval" && onUpdate){
        onUpdate({...deleteConfirmation.data, isVerified: !deleteConfirmation.data?.isVerified});
      }
      handleCloseDialog();
    } catch (error) {

    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedIds = data.map((row) => row._id);
      setSelectedIds(newSelectedIds);
    } else {
      setSelectedIds([]);
    }
  };
  const handleSelectOne = (event: React.ChangeEvent<HTMLInputElement>, row: any) => {
    if (event.target.checked) {
      setSelectedIds([row._id]);
    } else {
      setSelectedIds(selectedIds.filter((id: any) => id !== row._id));
    }
  }

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
                {selectedIds && <TableCell>
                  <Checkbox
                    color="primary"
                    indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                    checked={selectedIds.length === data.length}
                    // onChange={handleSelectAll}
                  />
                </TableCell>}
                {columns.map((col, index) => (
                  <TableCell key={index}>{col.header}</TableCell>
                ))}
                {!hideAction?<TableCell
                  sx={{
                    position: "sticky",
                    right: 0,
                    backgroundColor: "#FAF9F6",
                    zIndex: 10,
                    boxShadow: "10px 10px",
                  }}
                >
                  ACTIONS
                </TableCell>:null}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 &&
                data.map((row, rowIndex) => (
                  <TableRow key={rowIndex} style={{ textDecoration: "none", color: "inherit" }}>
                    {selectedIds && <TableCell>
                      <Checkbox
                        color="primary"
                        checked={selectedIds.includes(row._id)}
                        onChange={(e) => {
                          handleSelectOne(e, row)
                        }}
                      />
                    </TableCell>}
                    {columns.map((col, colIndex) => (
                      <TableCell key={colIndex}>
                        {col.render ? col.render(row) : row[col.accessor]}
                      </TableCell>
                    ))}
                    {/* Action Column */}
                    {!hideAction ? <TableCell
                      sx={{
                        position: "sticky",
                        right: 0,
                        backgroundColor: "#FAF9F6",
                        zIndex: 1,
                        boxShadow: "10px 10px",
                      }}
                    >
                      <EditIcon className="cursor-pointer" color="success" onClick={() => {
                        toggleModal(row?._id)
                      }} />

                      <DeleteIcon color="error" onClick={() => onActionClick(row)} />
                      {isAdminOrSuperVisorOrHR(userData) && module == MODULES.PATIENTS ? (
                        <span onClick={() => handleOpenDialog(row, "Approval")}>
                          {row?.isVerified ? <VerifiedIcon color="success" /> : <NewReleasesIcon color="error" />}
                        </span>
                      ) : null}
                    </TableCell> : null}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[rows]}
          component="div"
          count={total}
          rowsPerPage={rows}
          page={currentPage - 1}
          onPageChange={onPageChange}
        />
      </Grid>
      <ConfirmationDialog
        open={deleteConfirmation.visible}
        title={`${deleteConfirmation.type} Confirmation`}
        message={deleteConfirmation.type === "Delete" ? "Are you sure you want to delete this item? This action cannot be undone." : `Are you sure you want to ${deleteConfirmation?.data?.isVerified ? "unverify" : "verify"}  this? `}
        onConfirm={handleConfirm}
        onCancel={handleCloseDialog}
        confirmText={'Yes'}
        cancelText="Cancel"
      />
    </>
  );
};

export default GridTable;
