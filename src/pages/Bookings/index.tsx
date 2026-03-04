
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { MODULES } from '../../utils/constants';
import AddBookingDialog from './AddBookingDialog';
import { COLUMNS, BOOKING_TYPES } from './constants';
import { useBookingStore } from '../../services/bookings';
import { BookingQueryParams } from '../../types/bookings';

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

    const [tabValue, setTabValue] = useState('all');

    useEffect(() => {
        fetchGrid();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
        const newFilters: BookingQueryParams = {};
        if (newValue !== 'all') {
            newFilters.bookingType = newValue as any;
        }
        setFilters(newFilters);
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
