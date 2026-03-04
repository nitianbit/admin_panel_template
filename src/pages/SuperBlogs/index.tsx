import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { usePackageStore } from '../../services/packages';
import { MODULES } from '../../utils/constants';
import AddSuperBlogDialog from './AddSuperBlogsDialog';
import { COLUMNS } from './constants';
import { useSuperBlogStore } from '../../services/superblogs';

const SuperBlogs = () => {
    const { data, totalPages, currentPage, total, rows, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useSuperBlogStore();

    React.useEffect(() => {
        fetchGrid()
    }, [])



    return (
        <Layout appBarTitle="Packages">
            <Layout.Header component={AddSuperBlogDialog} />
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

export default SuperBlogs