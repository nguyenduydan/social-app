import { api } from "@/lib/axios";

export const conversationService = {
    // Tạo conversation mới
    createConversation: async (data) => {
        const response = await api.post('/conversations', data);
        return response.data;
    },

    // Lấy danh sách conversations
    getConversations: async () => {
        const response = await api.get('/conversations');
        return response.data;
    },

    // Lấy messages của một conversation
    getMessages: async (conversationId, limit = 50, cursor = null) => {
        const params = { limit };
        if (cursor) params.cursor = cursor;

        const response = await api.get(
            `/conversations/${conversationId}/messages`,
            { params }
        );
        return response.data;
    },
};
