import { api } from "@/lib/axios";

export const postService = {
    create: async (formData) => {
        const res = await api.post("/posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return res.data;
    },

    getAll: async (page = 1, limit = 5) => {
        const res = await api.get(`/posts?page=${page}&limit=${limit}`);
        return res.data;
    },

    getById: async (postId) => {
        const res = await api.get(`/posts/${postId}`);
        return res.data;
    },

    delete: async (postId) => {
        const res = await api.delete(`/posts/${postId}`);
        return res.data;
    }
};
