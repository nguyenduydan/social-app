import { create } from "zustand";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { authService } from "@/services/authService";

export const useAuthStore = create((set, get) => ({
    user: null, // Dữ liệu user
    loading: false,
    step: 1,
    cooldown: 0,
    accessToken: null,
    isRefreshing: false,

    formData: {
        email: "",
        code: "",
        newPassword: "",
        confirmPassword: "",
    },
    // Cập nhật formData
    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),

    //clear state - mục đích để tái sử dụng
    clearState: () => {
        set({ accessToken: null, user: null, loading: false });
    },


    setAccessToken: (accessToken) => {
        set({ accessToken });
    },

    // Reset lại flow forgot password
    resetFlow: () =>
        set({
            step: 1,
            formData: { email: "", code: "", newPassword: "", confirmPassword: "" },
            cooldown: 0
        }),

    refresh: async () => {
        try {
            set({ loading: true });
            const { user, fetchMe, setAccessToken } = get();

            const accessToken = await authService.refresh();

            setAccessToken(accessToken);
            if (!user) {
                await fetchMe();
            }

        } catch (error) {
            console.log("Error refreshing token:", error);
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
            get().clearState();
        } finally {
            set({ loading: false });
        }
    },

    // Kiểm tra Auth khi reload
    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user });
        } catch (error) {
            set({ user: null });
            console.log("Error: ", error);
            toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại");
        } finally {
            set({ loading: false });
        }
    },

    // Đăng ký
    signUp: async (firstName, lastName, email, password) => {
        try {
            set({ loading: true });
            //call api
            await authService.signUp(firstName, lastName, email, password);
            toast.success("Đăng ký thành công!");
        } catch (error) {
            console.log("Error in signup:", error);
            toast.error("Đăng ký không thành công!");
        } finally {
            set({ loading: false });
        }
    },

    // Đăng nhập
    signIn: async (email, password) => {
        try {
            set({ loading: true });
            const { accessToken } = await authService.signIn(email, password);
            get().setAccessToken(accessToken);
            await get().fetchMe();
            toast.success("Đăng nhập thành công!");
        } catch (error) {
            console.log("Error in login:", error);
            toast.error("Đăng nhập thất bại");
        } finally {
            set({ loading: false });
        }
    },

    // Đăng nhập bằng Google
    loginWithGoogle: () => {
        window.location.href = "http://localhost:3000/api/auth/google";
    },

    // Đăng xuất
    signOut: async () => {
        try {
            const { clearState } = get();
            clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.log("Error in logout:", error);
            toast.error("Đăng xuất không thành công");
        }
    },

    // Gửi mã reset password
    forgotPassword: async () => {
        const { formData } = get();
        if (!formData.email) {
            toast.error("Please enter your email");
            return;
        }

        set({ loading: true });
        try {
            const res = await api.post("/auth/forgot-password", { email: formData.email });
            toast.success(res.data?.message || "Reset code sent!");
            set({ step: 2 }); // Chuyển sang bước nhập mã
            get().startCooldown();
        } catch (error) {
            console.log("Error in forgotPassword:", error);
            const message = error?.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },

    // Xác minh mã
    verifyResetCode: async () => {
        const { formData } = get();

        if (!formData.code) {
            toast.error("Please enter the verification code");
            return;
        }

        set({ loading: true });
        try {
            const res = await api.post("/auth/verify-reset-code", {
                email: formData.email,
                code: formData.code,
            });
            toast.success(res.data?.message || "Code verified successfully");
            set({ step: 3 });
        } catch (error) {
            console.log("Error in verifyResetCode:", error);
            const message = error?.response?.data?.message || "Invalid code";
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },

    // Đặt lại mật khẩu
    resetPassword: async () => {
        const { formData } = get();
        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        set({ loading: true });
        try {
            const res = await api.patch("/auth/reset-password", {
                email: formData.email,
                newPassword: formData.newPassword,
            });
            toast.success(res.data?.message || "Password reset successfully");
            get().resetFlow();
        } catch (error) {
            console.log("Error in resetPassword:", error);
            const message = error?.response?.data?.message || "Failed to reset password";
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },

    startCooldown: () => {
        set({ cooldown: 60 });
        const interval = setInterval(() => {
            set((state) => {
                if (state.cooldown <= 1) {
                    clearInterval(interval);
                    return { cooldown: 0 };
                }
                return { cooldown: state.cooldown - 1 };
            });
        }, 1000);
    },

}));
