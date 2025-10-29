import { api } from "@/lib/axios";

export const friendService = {
    // Kiểm tra trạng thái bạn bè giữa 2 user
    checkFriend: async (userId) => {
        const res = await api.get(`/friends/status/${userId}`);
        return res.data;
    },

    // Lấy danh sách bạn bè (phân trang)
    getFriendAll: async (page, limit) => {
        const res = await api.get(`/friends?page=${page}&limit=${limit}`);
        return res.data;
    },

    // Lấy danh sách lời mời kết bạn (phân trang)
    getFriendRequests: async (page, limit) => {
        const res = await api.get(`/friends/requests?page=${page}&limit=${limit}`);
        return res.data;
    },

    // Lấy gợi ý kết bạn
    getFriendSuggestions: async (limit) => {
        const res = await api.get(`/friends/suggestions?limit=${limit}`);
        return res.data;
    },

    // Gửi lời mời kết bạn (userId của người nhận)
    sendRequest: async (userId) => {
        const res = await api.post(`/friends/request/${userId}`);
        return res.data;
    },

    // Chấp nhận lời mời (theo friendshipId)
    acceptRequest: async (friendshipId) => {
        const res = await api.put(`/friends/accept/${friendshipId}`);
        return res.data;
    },

    // Từ chối lời mời (theo friendshipId)
    rejectRequest: async (friendshipId) => {
        const res = await api.put(`/friends/reject/${friendshipId}`);
        return res.data;
    },

    // Hủy kết bạn / xóa bạn (theo friendshipId)
    removeFriend: async (friendshipId) => {
        const res = await api.delete(`/friends/${friendshipId}`);
        return res.data;
    },
};
