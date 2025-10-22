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

        // Nếu lỗi 403 (token hết hạn)
        if (error.response?.status === 403 && originalRequest._retryCount < 3) {
            originalRequest._retryCount += 1;

            try {
                // Nếu chưa có refreshPromise => tạo mới
                if (!refreshPromise) {
                    refreshPromise = api
                        .post("/auth/refresh", {}, { withCredentials: true })
                        .then((res) => {
                            const newAccessToken = res.data.accessToken;
                            useAuthStore.getState().setAccessToken(newAccessToken);
                            return newAccessToken;
                        })
                        .catch((err) => {
                            useAuthStore.getState().clearState();
                            throw err;
                        })
                        .finally(() => {
                            refreshPromise = null; // clear lock
                        });
                }

                // Đợi refresh xong
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
