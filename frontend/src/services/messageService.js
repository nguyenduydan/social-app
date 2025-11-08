import { api } from "@/lib/axios";

export const messageService = {
    // Gửi tin nhắn trực tiếp
    sendDirectMessage: async (data) => {
        const response = await api.post('/messages/direct', data);
        return response.data;
    },

    // Gửi tin nhắn nhóm
    sendGroupMessage: async (data) => {
        const response = await api.post('/messages/group', data);
        return response.data;
    },
};
