import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddHealthTipsDialog from './AddHealthTipsDialog';
import { COLUMNS } from './constants';
import { useHealthTipStore } from '../../services/healthTips';

const HealthTips = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        rows,
        isLoading,
        fetchGrid,
        onPageChange,
        onDelete
    } = useHealthTipStore();

    React.useEffect(() => {
        fetchGrid();
    }, []);

    return (
        <Layout appBarTitle="Health Tips">
            <Layout.Header component={AddHealthTipsDialog} />
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
                    module: MODULES.HEALTH_TIP,
                    onDelete: (item: any) => onDelete(item._id),
                    rows
                }}
            />
        </Layout>
    );
};

export default HealthTips;
