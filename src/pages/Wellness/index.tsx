import * as React from "react";
import Paper from "@mui/material/Paper";
import Appbar from "../../components/Appbar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { Avatar, Grid, Box } from "@mui/material";
import { useDoctorStore } from "../../services/doctors";
import GeneralTable from "../../components/GridTable";
import { MODULES } from "../../utils/constants";
import Layout from "../../components/Layout";
import { useCompanyStore } from "../../services/company";
import EditWellnessDialog from "./EditWellnessDialog";
import { COLUMNS } from "./constants";
import { useWellnessStore } from "../../services/wellness";

export default function Wellness() {
  const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useWellnessStore();
  const [open, setOpen] = React.useState(false);

  const { globalCompanyId } = useCompanyStore();

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
    <Layout appBarTitle="Wellness">
      <Layout.Header component={EditWellnessDialog} />
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

}
