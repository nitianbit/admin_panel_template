import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';
import { useOfferStore } from '../../services/offers';
import { useCompanyStore } from '../../services/company';
import { useNotificationStore } from '../../services/notifications';
import AddNotificationDialog from './AddNotificationDialog';


const PushNotificationGrid = () => {
    const { data, totalPages, currentPage, total, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useNotificationStore();
      const { globalCompanyId } = useCompanyStore();
    
    // React.useEffect(() => {
    //     fetchGrid()
    // }, [])

      React.useEffect(() => {
          if (globalCompanyId) {
            setFilters({ company_id: globalCompanyId })
          } else {
            fetchGrid()
          }
        }, [globalCompanyId])

    return (
        <Layout appBarTitle="Offers">
            <Layout.Header component={AddNotificationDialog} />
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
                    module: MODULES.OFFER,
                    onDelete: (data: any) => onDelete(data._id)
                }}
            />


        </Layout>
    )
}

export default PushNotificationGrid