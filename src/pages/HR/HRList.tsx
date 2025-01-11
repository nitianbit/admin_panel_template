import * as React from "react";
import GeneralTable from "../../components/GridTable";
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import Layout from "../../components/Layout";
import { useCompanyStore } from "../../services/company";
import AddHRDialog from "./AddHRDialog";
import { useHRStore } from "../../services/hr";

export default function HRList() {
  const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useHRStore();

  const { globalCompanyId } = useCompanyStore();

  React.useEffect(() => {
    if (globalCompanyId) {
      setFilters({ company: globalCompanyId })
    } else {
      fetchGrid()
    }
  }, [globalCompanyId])



  return (
    <Layout appBarTitle="HR">
      <Layout.Header component={AddHRDialog} />
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
          module: MODULES.HR,
          onDelete: (data: any) => onDelete(data._id)
        }}
      />


    </Layout>
  )
}