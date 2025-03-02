import * as React from "react";
import Paper from "@mui/material/Paper";
import Appbar from "../../components/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Avatar, Grid, Box } from "@mui/material";
import AddDoctorDialog from "./AddDoctorDialog";
import { useDoctorStore } from "../../services/doctors";
import GeneralTable from "../../components/GridTable";
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import Layout from "../../components/Layout";
import { useCompanyStore } from "../../services/company";

export default function DoctorList() {
  const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useDoctorStore();
  const [open, setOpen] = React.useState(false);
  const { globalCompanyId } = useCompanyStore();

  // React.useEffect(() => {
  //     fetchGrid()
  // }, [])

  React.useEffect(() => {
    if (globalCompanyId) {
      setFilters({ company: globalCompanyId })
    } else {
      fetchGrid()
    }
  }, [globalCompanyId])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleEdit = async (id: string) => [
    await detail(id),
    handleClickOpen()
  ]


  return (
    <Layout appBarTitle="Doctors">
      <Layout.Header component={AddDoctorDialog} />
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
      <Appbar appBarTitle="Doctor List" />
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
          <AddDoctorDialog open={open} setOpen={setOpen} />
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
            onEdit={handleEdit}
          />
        </Container>
      </Box>
    </Box>
  );
}
