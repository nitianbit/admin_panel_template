import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddUserDialog from './AddUserDialog';
import { getColumns } from './constants';
import { useUserStore } from '../../services/user';
import { useCompanyStore } from '../../services/company';

const Users = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        rows,
        isLoading,
        onPageChange,
        onDelete,
        setFilters,
    } = useUserStore();
    const { globalCompanyId } = useCompanyStore();

    React.useEffect(() => {
        if (!globalCompanyId || globalCompanyId === "general") {
            // General (non-corporate) scope: call /users?forUser=true
            setFilters({ forUser: true } as any);
        } else {
            // Corporate scope: filter users by corporateId
            setFilters({ corporateId: globalCompanyId } as any);
        }
    }, [globalCompanyId, setFilters]);

    return (
        <Layout appBarTitle="User Management">
            <Layout.Header component={AddUserDialog} />
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
                    module: MODULES.USER,
                    onDelete: (item: any) => onDelete(item._id),
                    rows
                }}
            />
        </Layout>
    );
};

export default Users;

