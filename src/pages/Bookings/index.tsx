
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddBookingDialog from './AddBookingDialog';
import { COLUMNS, BOOKING_TYPES } from './constants';
import { useBookingStore } from '../../services/bookings';
import { BookingQueryParams } from '../../types/bookings';
import { useCompanyStore } from '../../services/company';

const Bookings = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        isLoading,
        fetchGrid,
        onPageChange: storePageChange,
        onDelete,
        limit,
        setFilters,
        filters
    } = useBookingStore();
    const { globalCompanyId } = useCompanyStore();

    const [tabValue, setTabValue] = useState('all');

    // Recompute filters whenever tab or corporate scope changes
    useEffect(() => {
        const newFilters: BookingQueryParams = {};

        if (tabValue !== 'all') {
            newFilters.bookingType = tabValue as any;
        }

        if (!globalCompanyId || globalCompanyId === 'general') {
            // General (non-corporate) scope: call /bookings?forUser=true
            (newFilters as any).forUser = true;
        } else {
            // Corporate scope: pass corporateId in query
            newFilters.corporateId = globalCompanyId;
        }

        setFilters(newFilters);
    }, [tabValue, globalCompanyId, setFilters]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <Layout appBarTitle="Bookings Management">

            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking type tabs">
                    <Tab label="All Bookings" value="all" />
                    {BOOKING_TYPES.map((type) => (
                        <Tab key={type.value} label={type.label} value={type.value} />
                    ))}
                </Tabs>
            </Box>

            <Layout.Header component={AddBookingDialog} />

            <Layout.Body
                component={GridTable}
                props={{
                    data,
                    columns: COLUMNS,
                    currentPage,
                    totalPages,
                    total,
                    loading: isLoading,
                    onPageChange: storePageChange,
                    module: MODULES.BOOKING,
                    onDelete: (item: any) => onDelete(item._id),
                    rows: limit
                }}
            />
        </Layout>
    );
};

export default Bookings;
