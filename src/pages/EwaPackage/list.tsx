import React from "react";
import GridTable from "../../components/GridTable";
import Layout from "../../components/Layout";
import { useEwaPackageStore } from "../../services/ewaPackage"; 
import { MODULES } from "../../utils/constants";
import { COLUMNS } from "./constants";
import EwaPackageDialog from "../EwaPackage/EwaPackageDialog";

const EwaPackage = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        isLoading,
        fetchGrid,
        onPageChange,
        onDelete
    } = useEwaPackageStore();

    React.useEffect(() => {
        fetchGrid();
    }, []);

    return (
        <Layout appBarTitle="EWA Packages Form Submissions">
            {/* MODAL */}
            <Layout.Header component={EwaPackageDialog} />

            {/* TABLE */}
            <Layout.Body
                component={GridTable}
                props={{
                    data,
                    columns: COLUMNS,
                    currentPage,
                    totalPages,
                    total,
                    loading: isLoading,
                    onPageChange,
                    module: MODULES.EWA_PACKAGE, // <-- must exist in constants
                    onDelete: (row: any) => onDelete(row._id)
                }}
            />
        </Layout>
    );
};

export default EwaPackage;
