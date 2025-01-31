import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import { useServicesImagesStore } from '../../services/servicesImages/servicesImages';
import AddServicesImagesDialog from './AddServicesImagesDialog';


const ServicesImages = () => {
    const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useServicesImagesStore();
    React.useEffect(() => {
        fetchGrid()
    }, [])

    return (
        <Layout appBarTitle="Services Images">
            <Layout.Header component={AddServicesImagesDialog} />
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
                    module: MODULES.ServicesImages,
                    onDelete: (data: any) => onDelete(data._id)
                }}
            />


        </Layout>
    )
}

export default ServicesImages