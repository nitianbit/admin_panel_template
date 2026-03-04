
import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddCorporateDialog from './AddCorporateDialog';
import { getColumns } from './constants';
import { useCorporateStore } from '../../services/corporates';

const Corporates = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        isLoading,
        fetchGrid,
        onPageChange,
        onDelete,
        limit
    } = useCorporateStore();

    React.useEffect(() => {
        fetchGrid();
    }, []);

    return (
        <Layout appBarTitle="Corporates Management">
            <Layout.Header component={AddCorporateDialog} />
            <Layout.Body
                component={GridTable}
                props={{
                    data,
                    columns: getColumns(currentPage, limit),
                    currentPage,
                    totalPages,
                    total,
                    loading: isLoading,
                    onPageChange,
                    module: MODULES.CORPORATE,
                    onDelete: (item: any) => onDelete(item._id),
                    rows: limit
                }}
            />
        </Layout>
    );
};

export default Corporates;

