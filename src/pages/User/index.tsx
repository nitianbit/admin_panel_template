import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddUserDialog from './AddUserDialog';
import { COLUMNS } from './constants';
import { useUserStore } from '../../services/user';

const Users = () => {
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
    } = useUserStore();

    React.useEffect(() => {
        fetchGrid();
    }, []);

    return (
        <Layout appBarTitle="User Management">
            <Layout.Header component={AddUserDialog} />
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
                    module: MODULES.USER,
                    onDelete: (item: any) => onDelete(item._id),
                    rows
                }}
            />
        </Layout>
    );
};

export default Users;
