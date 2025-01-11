import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Appbar from "../../components/Appbar";

import GeneralTable from '../../components/GridTable/index'
import { COLUMNS } from "./constants";
import { MODULES } from "../../utils/constants";
import { useCompanyStore } from "../../services/company";
import Layout from "../../components/Layout";
import PrescriptionReportDialog from "./ReportDialog";
import { useReportStore } from "../../services/report";

function Report() {
    const { data, totalPages, total, rows, currentPage, filters, isLoading, onPageChange, fetchGrid, onDelete, nextPage, prevPage, setFilters } = useReportStore();
    const { globalCompanyId } = useCompanyStore();

    useEffect(() => {
        if (globalCompanyId) {
            setFilters({ company: globalCompanyId })
        } else {
            fetchGrid()
        }
    }, [globalCompanyId])


    return (
        <Layout appBarTitle="Report">
            <Layout.Header component={PrescriptionReportDialog} />
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
                    module: MODULES.REPORT,
                    onDelete: (data: any) => onDelete(data._id)
                }}
            />


        </Layout>
    )
}

export default Report;
