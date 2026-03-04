import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { getColumns } from './constants';
import { MODULES } from '../../utils/constants';
import AddWellnessPackageDialog from './AddWellnessPackageDialog';
import { useWellnessPackageStore } from '../../services/wellnessPackages';


const WellnessPackages = () => {
    const { data, totalPages, currentPage, total, rows, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useWellnessPackageStore();
    React.useEffect(() => {
        fetchGrid()
    }, [])

    return (
        <Layout appBarTitle="Wellness Packages">
            <Layout.Header component={AddWellnessPackageDialog} />
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
                    module: MODULES.WELLNESS_PACKAGE,
                    onDelete: (data: any) => onDelete(data._id),
                    rows
                }}
            />


        </Layout>
    )
}

export default WellnessPackages

