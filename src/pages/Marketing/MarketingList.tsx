import * as React from "react";
import GeneralTable from "../../components/GridTable";
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import Layout from "../../components/Layout";
import { useCompanyStore } from "../../services/company";
import AddMARKETINGDialog from "./AddMarketingDialog";
import { useMARKETINGStore } from "../../services/marketing";

export default function MARKETINGList() {
  const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useMARKETINGStore();

  const { globalCompanyId } = useCompanyStore();

  React.useEffect(() => {
    if (globalCompanyId) {
      setFilters({ company: globalCompanyId })
    } else {
      fetchGrid()
    }
  }, [globalCompanyId])



  return (
    <Layout appBarTitle="MARKETING">
      <Layout.Header component={AddMARKETINGDialog} />
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
          module: MODULES.MARKETING,
          onDelete: (data: any) => onDelete(data._id)
        }}
      />


    </Layout>
  )
}