import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true,
});

// 🔐 Biến lock để tránh gọi /refresh trùng
let refreshPromise = null;

api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // Những API không cần check token
        if (
            originalRequest.url.includes("/auth/signin") ||
            originalRequest.url.includes("/auth/signup") ||
            originalRequest.url.includes("/auth/google") ||
            originalRequest.url.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        // Giới hạn retry
        originalRequest._retryCount = originalRequest._retryCount || 0;

        const { accessToken } = useAuthStore.getState();

        // Nếu chưa login thì KHÔNG gọi refresh
        if (!accessToken && originalRequest._retryCount === 0) {
            useAuthStore.getState().clearState();
            return Promise.reject(error);
        }

        // Nếu lỗi 403 (token hết hạn)
        if (
            [401, 403].includes(error.response?.status) &&
            originalRequest._retryCount < 3
        ) {
            originalRequest._retryCount += 1;

            try {
                if (!refreshPromise) {
                    // Gọi refresh token chỉ 1 lần cho tất cả request đang pending
                    refreshPromise = api
                        .post("/auth/refresh", {}, { withCredentials: true })
                        .then((res) => {
                            const newAccessToken = res.data.accessToken;
                            useAuthStore
                                .getState()
                                .setAccessToken(newAccessToken);
                            return newAccessToken;
                        })
                        .catch((err) => {
                            console.error("Refresh token failed:", err);
                            useAuthStore.getState().clearState();
                            throw err;
                        })
                        .finally(() => {
                            refreshPromise = null;
                        });
                }

                const newAccessToken = await refreshPromise;

                // Retry lại request gốc với token mới
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        // Nếu vượt quá 3 lần → logout
        if (originalRequest._retryCount >= 3) {
            useAuthStore.getState().clearState();
        }

        return Promise.reject(error);
    }
);
