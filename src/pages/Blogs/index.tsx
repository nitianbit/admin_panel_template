import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { usePackageStore } from '../../services/packages';
import { MODULES } from '../../utils/constants';
import AddBlogDialog from './AddBlogsDialog';
import { COLUMNS } from './constants';
import { useBlogStore } from '../../services/blogs';

const Blogs = () => {
    const { data, totalPages, currentPage, total, rows, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useBlogStore();

    React.useEffect(() => {
        fetchGrid()
    }, [])



    return (
        <Layout appBarTitle="Packages">
            <Layout.Header component={AddBlogDialog} />
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

export default Blogs