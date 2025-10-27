import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import LoadPage from "../common/loaders/LoadPage";

const ProtectedRoute = () => {
    const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
    const [starting, setStarting] = useState(true);

    const init = async () => {
        try {
            const hasLoggedInBefore = localStorage.getItem("loggedIn") === "true";

            // Nếu chưa từng đăng nhập thì không gọi refresh
            if (!accessToken && !hasLoggedInBefore) {
                setStarting(false);
                return;
            }

            // Nếu đã login trước đó nhưng token hết hạn → refresh
            if (!accessToken && hasLoggedInBefore) {
                await refresh();
            }

            // Nếu có token mà chưa có user info → fetch
            if (useAuthStore.getState().accessToken && !user) {
                await fetchMe();
            }
        } catch (err) {
            console.error("ProtectedRoute init error:", err);
        } finally {
            setStarting(false);
        }
    };

    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (starting || loading) {
        return <LoadPage />;
    }

    if (!accessToken) {
        return <Navigate to="/signin" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
