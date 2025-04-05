import React from 'react';
import GridTable from '../../components/GridTable';
import Layout from '../../components/Layout';
import { useFormStore } from '../../services/form';
import { MODULES } from '../../utils/constants';
import { COLUMNS } from './constants';

const Form = () => {
    const {
        data,
        totalPages,
        currentPage,
        total,
        filters,
        isLoading,
        detail,
        fetchGrid,
        setFilters,
        nextPage,
        prevPage,
        onPageChange,
        onDelete
    } = useFormStore();

 
    React.useEffect(() => {
 
            fetchGrid(); 
    }, []);

    return (
        <Layout appBarTitle="Forms">
            {/* <Layout.Header component={AddFormDialog} /> */}
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
                    module: MODULES.FORM, // make sure this exists in your MODULES
                    onDelete: (data: any) => onDelete(data._id)
                    
                }}
            />
        </Layout>
    );
};

export default Form;
