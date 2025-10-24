import { create } from "zustand";
import { userService } from "@/services/userService";
import { toast } from "sonner";

export const useUserStore = create((set) => ({
    currentUser: null,
    loading: false,

    //Lấy thông tin user theo ID
    fetchUserById: async (userId) => {
        try {
            set({ loading: true });
            const data = await userService.getById(userId);
            set({ currentUser: data.user });
        } catch (error) {
            console.error("Lỗi fetchUserById:", error);
            toast.error(error.response?.data?.message || "Không thể tải thông tin người dùng");
        } finally {
            set({ loading: false });
        }
    },

    // Cập nhật thông tin cơ bản
    updateUserInfo: async (userId, info) => {
        try {
            set({ loading: true });
            const data = await userService.updateInfo(userId, info);
            set({ currentUser: data.user });
            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi updateUserInfo:", error);
            toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại!");
        } finally {
            set({ loading: false });
        }
    },

    //Cập nhật avatar
    updateAvatar: async () => {

    },

    //Cập nhật ảnh bìa
    updateCoverPhoto: async () => {

    },
}));
