import { api } from "@/lib/axios";

export const friendService = {
    // Kiểm tra trạng thái bạn bè giữa 2 user
    checkFriend: async (userId) => {
        const res = await api.get(`/friends/status/${userId}`);
        return res.data;
    },

    // Lấy danh sách bạn bè (phân trang)
    getFriendAll: async (page = 1, limit = 10, search = "") => {
        const res = await api.get(`/friends?page=${page}&limit=${limit}&search=${search}`);
        return res.data;
    },

    // Lấy danh sách lời mời kết bạn
    // type: 'received' | 'sent'
    getFriendRequests: async (page = 1, limit = 10, type = "received") => {
        const res = await api.get(`/friends/requests?page=${page}&limit=${limit}&type=${type}`);
        return res.data;
    },

    // Lấy gợi ý kết bạn (cơ bản)
    getFriendSuggestions: async (limit = 10) => {
        const res = await api.get(`/friends/suggestions?limit=${limit}`);
        return res.data;
    },

    // Lấy gợi ý kết bạn nâng cao (mutual friends)
    getAdvancedFriendSuggestions: async (limit = 10) => {
        const res = await api.get(`/friends/suggestions/advanced?limit=${limit}`);
        return res.data;
    },

    // Gửi lời mời kết bạn
    sendRequest: async (toUserId, message = "") => {
        const res = await api.post(`/friends/requests`, { to: toUserId, message });
        return res.data;
    },

    // Chấp nhận lời mời kết bạn (theo requestId)
    acceptRequest: async (requestId) => {
        const res = await api.put(`/friends/requests/${requestId}/accept`);
        return res.data;
    },

    // Từ chối lời mời kết bạn
    rejectRequest: async (requestId) => {
        const res = await api.put(`/friends/requests/${requestId}/reject`);
        return res.data;
    },

    // Hủy lời mời đã gửi
    cancelRequest: async (requestId) => {
        const res = await api.delete(`/friends/requests/${requestId}/cancel`);
        return res.data;
    },

    // Xóa bạn (unfriend)
    removeFriend: async (friendshipId) => {
        const res = await api.delete(`/friends/${friendshipId}`);
        return res.data;
    },
};
