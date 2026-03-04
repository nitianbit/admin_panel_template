import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import AddServiceImageDialog from './AddServiceImageDialog';
import { useServiceImageStore } from '../../services/serviceImages';


const ServiceImages = () => {
    const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useServiceImageStore();
    React.useEffect(() => {
        fetchGrid()
    }, [])

    return (
        <Layout appBarTitle="Service Images">
            <Layout.Header component={AddServiceImageDialog} />
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
                    module: MODULES.SERVICE_IMAGES,
                    onDelete: (data: any) => onDelete(data._id)
                }}
            />


        </Layout>
    )
}

export default ServiceImages