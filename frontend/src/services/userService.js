import { api } from "@/lib/axios";

const userService = {
    getById: async (userId) => {
        const res = await api.get(`/users/${userId}`);
        return res.data;
    }
};
