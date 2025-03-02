import * as React from "react";
import GeneralTable from "../../components/GridTable";
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import Layout from "../../components/Layout";
import { useCompanyStore } from "../../services/company";
import { useLaboratoryStore } from "../../services/laboratory";
import AddLaboratoryDialog from "./AddLaboratoryDialog";

export default function LaboratoryList() {
  const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useLaboratoryStore();
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
    <Layout appBarTitle="Patient">
      <Layout.Header component={AddLaboratoryDialog} />
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
          module: MODULES.LABORATORY,
          onDelete: (data: any) => onDelete(data._id)
        }}
      />


    </Layout>
  )
}
