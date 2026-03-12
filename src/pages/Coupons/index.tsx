
import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddCouponDialog from './AddCouponDialog';
import { COLUMNS } from './constants';
import { useCouponStore } from '../../services/coupons';
import { useCompanyStore } from '../../services/company';

const Coupons = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        isLoading,
        fetchGrid,
        setFilters,
        onPageChange,
        onDelete,
        limit
    } = useCouponStore();
    const { globalCompanyId } = useCompanyStore();

    React.useEffect(() => {
        if (!globalCompanyId || globalCompanyId === "general") {
            // General (non-corporate) scope: call /coupons?forUser=true
            setFilters({ forUser: true } as any);
        } else {
            // Corporate scope: filter by corporateId (existing behavior)
            setFilters({ corporateId: globalCompanyId } as any);
        }
    }, [globalCompanyId]);

    return (
        <Layout appBarTitle="Coupons Management">
            <Layout.Header component={AddCouponDialog} />
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
                    module: MODULES.COUPON,
                    onDelete: (item: any) => onDelete(item._id),
                    rows: limit
                }}
            />
        </Layout>
    );
};

export default Coupons;
