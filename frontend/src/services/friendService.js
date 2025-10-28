import { api } from "@/lib/axios";

export const friendService = {
    getFriendAll: async (page = 1, limit = 10) => {
        const res = await api.get(`/friends/?page=${page}&limit=${limit}`);
        return res.data;
    }
};
