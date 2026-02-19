
import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddSlotsDialog from './AddSlotsDialog';
import { COLUMNS } from './constants';
import { useSlotStore } from '../../services/slots';

const Slots = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        limit,
        isLoading,
        fetchGrid,
        onPageChange,
        onDelete
    } = useSlotStore();


    React.useEffect(() => {
        fetchGrid();
    }, []);

    return (
        <Layout appBarTitle="Slots Management">
            <Layout.Header component={AddSlotsDialog} />
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
                    module: MODULES.SLOTS,
                    onDelete: (item: any) => onDelete(item._id),
                    rows: limit
                }}
            />
        </Layout>
    );
};

export default Slots;
