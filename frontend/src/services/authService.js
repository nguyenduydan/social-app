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
        const res = await api.post("/auth/signin", { email, password }, { withCredentials: true });

        return res.data; //access token
    },
    signOut: async () => {
        return await api.post("/auth/logout", {}, { withCredentials: true });
    },
    fetchMe: async () => {
        const res = await api.get("/users/me", { withCredentials: true });
        return res.data.user;
    },
    refresh: async () => {
        const res = await api.post("/auth/refresh", { withCredentials: true });
        return res.data.accessToken;
    }

};
