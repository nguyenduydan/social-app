import { api } from "@/lib/axios";

export const authService = {
    signUp: async (
        firstName,
        lastName,
        email,
        password
    ) => {
        const res = await api.post("/auth/signup", {
            firstName, lastName, email, password
        }, { withCredentials: true });

        return res.data;
    },
    signIn: async (email, password) => {
        const res = await api.post("/auth/signin", { email, password });

        return res.data; //access token
    },
    signOut: async () => {
        return await api.post("/auth/logout", {});
    },
    fetchMe: async () => {
        const res = await api.get("/users/me");
        return res.data.user;
    },
    refresh: async () => {
        const res = await api.post("/auth/refresh");
        return res.data.accessToken;
    },

    forgotPassword: async (email) => {
        const res = await api.post("/auth/forgot-password", { email });
        return res.data;
    },
    verifyResetCode: async (email, code) => {
        const res = await api.post("/auth/verify-reset-code", { email, code });
        return res.data;
    },

    resetPassword: async (email, newPassword) => {
        const res = await api.patch("/auth/reset-password", { email, newPassword });
        return res.data;
    }

};
