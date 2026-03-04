import React from "react";
import GridTable from "../../components/GridTable";
import Layout from "../../components/Layout";
import { useCorporatePlanStore } from "../../services/corporatePlan/index";
import { MODULES } from "../../utils/constants";
import { COLUMNS } from "./constants";
import CorporatePlanDialog from "./CorporateDialog";

const CorporatePlan = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        filters,
        isLoading,
        fetchGrid,
        setFilters,
        nextPage,
        prevPage,
        onPageChange,
        onDelete
    } = useCorporatePlanStore();

    React.useEffect(() => {
        fetchGrid();
    }, []);

    return (
        <Layout appBarTitle="Corporate Plans">
            <Layout.Header component={CorporatePlanDialog} />

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
                    module: MODULES.CORPORATE_PLAN,
                    onDelete: (row: any) => onDelete(row._id)
                }}
            />
        </Layout>
    );
};

export default CorporatePlan;
