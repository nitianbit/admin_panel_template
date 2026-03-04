import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddPartnerDialog from './AddPartnerDialog';
import { getColumns } from './constants';
import { usePartnerStore } from '../../services/partners';
import { useCompanyStore } from '../../services/company';

const Partners = () => {
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
    } = usePartnerStore();
    const { globalCompanyId } = useCompanyStore();

    React.useEffect(() => {
        if (globalCompanyId) {
            setFilters({ corporateId: globalCompanyId });
        } else {
            fetchGrid();
        }
    }, [globalCompanyId]);

    return (
        <Layout appBarTitle="Partners Management">
            <Layout.Header component={AddPartnerDialog} />
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
                    module: MODULES.PARTNER,
                    onDelete: (item: any) => onDelete(item._id),
                    rows
                }}
            />
        </Layout>
    );
};

export default Partners;

