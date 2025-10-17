import { useAuthStore } from "@/store/useAuthStore";
import axios from "axios";


export const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api",
    withCredentials: true
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const { refreshAccessToken } = useAuthStore.getState();
            await refreshAccessToken();
            return api(originalRequest);
        }

        return Promise.reject(error);
    }
);
