import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { use } from 'echarts';
import { useDepartmentStore } from '../../services/departments';
import AddDepartmentDialog from './AddDepartmentDialog';
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';

const Departments = () => {
    const { data, totalPages, currentPage, total,rows, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useDepartmentStore();
    React.useEffect(() => {
        fetchGrid()
    }, [])

    return (
        <Layout appBarTitle="Departments">
            <Layout.Header component={AddDepartmentDialog} />
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

export default Departments