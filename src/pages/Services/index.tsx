import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { use } from 'echarts';
import AddServiceDialog from './AddServiceDialog';
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import { useServicestore } from '../../services/services';

const Departments = () => {
    const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useServicestore();
    React.useEffect(() => {
        fetchGrid()
    }, [])

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
                    module: MODULES.DEPARTMENT,
                    onDelete: (data: any) => onDelete(data._id)
                }}
            />


        </Layout>
    )
}

export default Departments