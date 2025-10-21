import { useAuthStore } from '@/store/useAuthStore';
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import LoadingPage from '../common/loaders/loadingPage';
import CuberLoader from '../common/loaders/cuberLoader';

const ProtectedRoute = () => {
    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        if (!accessToken) {
            await refresh();
        }

        if (accessToken && !user) {
            await fetchMe();
        }
        setStarting(false);
    };

    useEffect(() => {
        init();
    }, []);

    if (starting || loading) {
        return <CuberLoader />;
    }

    if (!accessToken) {
        return (
            <Navigate
                to="/signin"
                replace
            />
        );
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default ProtectedRoute;
