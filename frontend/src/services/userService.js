import { api } from "@/lib/axios";

export const userService = {
    getById: async (userId) => {
        const res = await api.get(`/users/${userId}`);
        return res.data;
    },
    getUserByUsername: async (username) => {
        const res = await api.get(`/users/username/${username}`);
        return res.data;
    },
    updateInfo: async (id, data) => {
        const res = await api.put(`/users/${id}`, data);
        return res.data;
    },
    uploadAvatar: async (file) => {
        const res = await api.patch("/users/upload-avatar", { avatar: file });
        return res.data;
    },
    uploadCoverPhoto: async (file) => {
        const res = await api.patch("/users/upload-cover", file);
        return res.data;
    },

};

