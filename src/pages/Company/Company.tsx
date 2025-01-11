import React, { useEffect, useState } from "react";
import CompanyDialog from "./CompanyDialog";
import GeneralTable from '../../components/GridTable/index'
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import { useCompanyStore } from "../../services/company";
import Layout from "../../components/Layout";

function Company() {
  const { data, totalPages, total, rows, currentPage, filters, isLoading, onPageChange, fetchGrid, onDelete, nextPage, prevPage } = useCompanyStore();
  useEffect(() => {
    fetchGrid()
  }, [])


  return (
    <Layout appBarTitle="Company">
      <Layout.Header component={CompanyDialog} />
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
          module: MODULES.COMPANY,
          onDelete: (data: any) => onDelete(data._id)
        }}
      />


    </Layout>
  )
}

export default Company;
