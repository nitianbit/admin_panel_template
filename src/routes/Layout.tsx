import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '../services/context/AppContext';
import { useEffect, useState } from 'react';
import { getValue, STORAGE_KEYS } from '../services/Storage';
import HeartRateLoader from '../components/HeartRateLoader';

const Layout = () => {
    const { isLoggedIn, error,isTokenVerified } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn && isTokenVerified) {
            navigate('/');
        }
    }, [isLoggedIn,isTokenVerified]);

    if (!isLoggedIn) {
        return <HeartRateLoader />
    }

    return <div className="d-flex">
        <Outlet />
    </div>;
};

export default Layout;
