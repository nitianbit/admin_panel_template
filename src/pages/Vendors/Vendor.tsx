import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'

import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import { useCompanyStore } from '../../services/company';
import AddVendorDialog from './AddVendorDialog';
import { useVendorStore } from '../../services/vendors';

const Vendors = () => {
    const { data, totalPages, currentPage, total, rows, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useVendorStore();
    const { globalCompanyId } = useCompanyStore();

    // React.useEffect(() => {
    //     if (globalCompanyId) {
    //         setFilters({ company: globalCompanyId });
    //     } else {
    //         fetchGrid();
    //     }
    // }, [globalCompanyId]);

    //this is vendor creation page so no company , all vendors can be seen 
    React.useEffect(() => {
            fetchGrid(); 
    }, []);

    return (
        <Layout appBarTitle="Vendors">
            <Layout.Header component={AddVendorDialog} />
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
                    module: MODULES.VENDORS,
                    onDelete: (data: any) => onDelete(data._id),
                    rows
                }}
            />
        </Layout>
    );
};

export default Vendors;
