import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import AddGalleryImageDialog from './AddGalleryImageDialog';
import { useGalleryImageStore } from '../../services/galleryImages';


const GalleryImages = () => {
    const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useGalleryImageStore();
    React.useEffect(() => {
        fetchGrid()
    }, [])

    return (
        <Layout appBarTitle="Gallery Images">
            <Layout.Header component={AddGalleryImageDialog} />
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
                    module: MODULES.GALLERY_IMAGES,
                    onDelete: (data: any) => onDelete(data._id)
                }}
            />


        </Layout>
    )
}

export default GalleryImages