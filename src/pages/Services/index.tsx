import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import AddServiceDialog from './AddServiceDialog';
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import { useServicestore } from '../../services/services';
import { useCompanyStore } from '../../services/company';

const Services = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        filters,
        isLoading,
        detail,
        fetchGrid,
        setFilters,
        nextPage,
        prevPage,
        onPageChange,
        onDelete
    } = useServicestore();

    const { globalCompanyId } = useCompanyStore();

    React.useEffect(() => {
        if (globalCompanyId) {
            setFilters({ company: globalCompanyId });
        } else {
            fetchGrid();
        }
    }, [globalCompanyId]);

    return (
        <Layout appBarTitle="Services">
            <Layout.Header component={AddServiceDialog} />
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
                    module: MODULES.SERVICES,
                    onDelete: (data: any) => onDelete(data._id)
                }}
            />
        </Layout>
    )
}

export default Services;
