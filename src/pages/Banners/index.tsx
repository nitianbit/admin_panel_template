import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import AddBannerDialog from './AddBannerDialog';
import { useBannerStore } from '../../services/banners';
import { useCompanyStore } from '../../services/company';


const Banners = () => {
    const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useBannerStore();
    const { globalCompanyId } = useCompanyStore();

    React.useEffect(() => {
        if (globalCompanyId) {
            setFilters({ corporateId: globalCompanyId });
        } else {
            fetchGrid();
        }
    }, [globalCompanyId]);

    return (
        <Layout appBarTitle="Banners">
            <Layout.Header component={AddBannerDialog} />
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
                    module: MODULES.BANNER,
                    onDelete: (data: any) => onDelete(data._id)
                }}
            />


        </Layout>
    )
}

export default Banners
