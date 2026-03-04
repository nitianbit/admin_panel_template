import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddHealthTipsDialog from './AddHealthTipsDialog';
import { getColumns } from './constants';
import { useHealthTipStore } from '../../services/healthTips';
import { useCompanyStore } from '../../services/company';

const HealthTips = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        rows,
        isLoading,
        fetchGrid,
        setFilters,
        onPageChange,
        onDelete
    } = useHealthTipStore();
    const { globalCompanyId } = useCompanyStore();

    React.useEffect(() => {
        if (globalCompanyId) {
            setFilters({ corporateId: globalCompanyId });
        } else {
            fetchGrid();
        }
    }, [globalCompanyId]);

    return (
        <Layout appBarTitle="Health Tips">
            <Layout.Header component={AddHealthTipsDialog} />
            <Layout.Body
                component={GridTable}
                props={{
                    data,
                    columns: getColumns(currentPage, rows),
                    currentPage,
                    totalPages,
                    total,
                    loading: isLoading,
                    onPageChange,
                    module: MODULES.HEALTH_TIP,
                    onDelete: (item: any) => onDelete(item._id),
                    rows
                }}
            />
        </Layout>
    );
};

export default HealthTips;

