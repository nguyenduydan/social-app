import { create } from "zustand";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { compressImage } from "@/lib/compressMedia";
import { fileToBase64 } from "@/lib/fileBase64";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set, get) => ({
    currentUser: null,
    loading: false,
    updating: false,

    // Cho phép cập nhật state thủ công
    setState: (user) => {
        set({ currentUser: user });
        const setAuth = useAuthStore.getState().setUser;
        setAuth({ user });
    },
    // Lấy thông tin user theo ID
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

    fetchUserByUsername: async (username) => {
        const { currentUser } = get();

        // Nếu đang xem cùng username thì bỏ qua
        if (currentUser?.username === username) return;

        set({ loading: true, error: null });

        try {
            const res = await userService.getUserByUsername(username);
            set({ currentUser: res.user || null });
        } catch (err) {
            console.error("Lỗi khi tải người dùng theo username:", err);
            set({ currentUser: null, error: err.response?.data || err });
        } finally {
            set({ loading: false });
        }
    },

    // Cập nhật thông tin cơ bản
    updateUserInfo: async (userId, info, navigate) => {
        try {
            set({ updating: true });
            const res = await userService.updateInfo(userId, info);

            const updatedUser = res.user;
            set({ currentUser: updatedUser });

            toast.success("Cập nhật thông tin thành công!");
            const setAuth = useAuthStore.getState().setUser;
            setAuth(updatedUser);
            // Nếu username đổi → điều hướng đến URL mới
            if (navigate && updatedUser.username) {
                navigate(`/profile/${updatedUser.username}`);
            }
        } catch (error) {
            console.error("Lỗi updateUserInfo:", error);
            toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại!");
        } finally {
            set({ updating: false });
        }
    },

    // Cập nhật avatar (dùng base64)
    updateAvatar: async (file) => {
        try {
            set({ updating: true });

            // Nén ảnh + chuyển sang base64
            const compressedFile = await compressImage(file);
            const base64 = await fileToBase64(compressedFile);

            // Gửi lên server
            const res = await userService.uploadAvatar({ avatar: base64 });
            const updatedUser = res.user;

            // Cập nhật store
            set({ currentUser: updatedUser });
            const setAuth = useAuthStore.getState().setUser;
            setAuth(updatedUser);

            //Hiển thị thông báo thành công
            toast.success("Ảnh đại diện đã được cập nhật!");
        } catch (error) {
            console.error("Lỗi updateAvatar:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật ảnh đại diện!");
        } finally {
            set({ updating: false });
        }
    },

    // Cập nhật ảnh bìa (dùng base64)
    updateCoverPhoto: async (file) => {
        try {
            set({ updating: true });
            const compressedFile = await compressImage(file);
            const base64 = await fileToBase64(compressedFile);

            const res = await userService.uploadCoverPhoto({ coverPhoto: base64 });
            const updatedUser = res.user;
            set({ currentUser: res.user });
            const setAuth = useAuthStore.getState().setUser;
            setAuth(updatedUser);

            toast.success("Ảnh bìa đã được cập nhật!");
        } catch (error) {
            console.error("Lỗi updateCoverPhoto:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật ảnh bìa!");
        } finally {
            set({ updating: false });
        }
    },
}));
