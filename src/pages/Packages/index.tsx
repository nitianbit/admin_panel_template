import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { use } from 'echarts';
import { usePackageStore } from '../../services/packages';
import AddPackageDialog from './AddPackageDialog';
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import { useCompanyStore } from '../../services/company';

const Packages = () => {
    const { data, totalPages, currentPage, total, rows, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = usePackageStore();
    const { globalCompanyId } = useCompanyStore();

    // React.useEffect(() => {
    //     fetchGrid()
    // }, [])

    React.useEffect(() => {
        if (globalCompanyId) {
            setFilters({ company: globalCompanyId })
        } else {
            fetchGrid()
        }
    }, [globalCompanyId])

    return (
        <Layout appBarTitle="Packages">
            <Layout.Header component={AddPackageDialog} />
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
                    module: MODULES.DEPARTMENT,
                    onDelete: (data: any) => onDelete(data._id),
                    rows
                }}
            />


        </Layout>
    )
}

export default Packages