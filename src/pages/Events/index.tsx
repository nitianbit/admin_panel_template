import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { use } from 'echarts';
import { useEventStore } from '../../services/events';
import AddEventDialog from './AddEventDialog';
import { COLUMNS } from './constants';
import { MODULES } from '../../utils/constants';

const Events = () => {
    const { data, totalPages, currentPage, total,rows, filters, isLoading, detail, fetchGrid, setFilters, nextPage, prevPage, onPageChange, onDelete } = useEventStore();
    React.useEffect(() => {
        fetchGrid()
    }, [])

    return (
        <Layout appBarTitle="Events">
            <Layout.Header component={AddEventDialog} />
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
                    module: MODULES.EVENT,
                    onDelete: (data: any) => onDelete(data._id),
                    rows
                }}
            />


        </Layout>
    )
}

export default Events