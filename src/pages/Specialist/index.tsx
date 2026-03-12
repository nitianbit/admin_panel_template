import React from 'react'
import Layout from '../../components/Layout'
import GridTable from '../../components/GridTable'
import { getColumns } from './constants';
import { MODULES } from '../../utils/constants';
import AddSpecialistDialog from './AddSpecialistDialog';
import { useSpecialistStore } from '../../services/specialist';
import { useCompanyStore } from '../../services/company';


const Specialists = () => {
    const { data, totalPages, currentPage, total, rows, filters, isLoading, detail, fetchGrid, fetchByCorporate, setFilters, nextPage, prevPage, onPageChange, onDelete } = useSpecialistStore();
    const { globalCompanyId } = useCompanyStore();

    React.useEffect(() => {
        if (!globalCompanyId || globalCompanyId === "general") {
            // General (non-corporate) scope: call /specialists?forUser=true
            setFilters({ forUser: true } as any);
        } else {
            // Corporate scope: hit /corporates/:id/specialists (no change)
            fetchByCorporate(globalCompanyId);
        }
    }, [globalCompanyId]);

    return (
        <Layout appBarTitle="Specialist">
            <Layout.Header component={AddSpecialistDialog} />
            <Layout.Body
                component={GridTable}
                props={{
                    data,
                    columns: getColumns(currentPage, rows),
                    currentPage,
                    totalPages,
                    total,
                    loading: isLoading,
                    onPageChange,
                    module: MODULES.SPECIALIST,
                    onDelete: (data: any) => onDelete(data._id),
                    rows
                }}
            />


        </Layout>
    )
}

export default Specialists

