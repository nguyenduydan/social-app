import { api } from "@/lib/axios";

export const userService = {
    getById: async (userId) => {
        const res = await api.get(`/users/${userId}`);
        return res.data;
    },
    updateInfo: async (id, data) => {
        const res = await api.put(`/users/${id}`, data);
        return res.data;
    },
};

