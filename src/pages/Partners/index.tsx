import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddPartnerDialog from './AddPartnerDialog';
import { COLUMNS } from './constants';
import { usePartnerStore } from '../../services/partners';

const Partners = () => {
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
    } = usePartnerStore();

    React.useEffect(() => {
        fetchGrid();
    }, []);

    return (
        <Layout appBarTitle="Partners Management">
            <Layout.Header component={AddPartnerDialog} />
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
                    module: MODULES.PARTNER,
                    onDelete: (item: any) => onDelete(item._id),
                    rows
                }}
            />
        </Layout>
    );
};

export default Partners;
