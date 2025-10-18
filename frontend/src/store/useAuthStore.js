import { create } from "zustand";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export const useAuthStore = create((set, get) => ({
    authUser: null, // Dữ liệu user
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isLoading: false,
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

    // Reset lại flow forgot password
    resetFlow: () =>
        set({
            step: 1,
            formData: { email: "", code: "", newPassword: "", confirmPassword: "" },
            cooldown: 0
        }),

    refreshAccessToken: async () => {
        const { isRefreshing } = get();
        if (isRefreshing) return; // tránh gọi nhiều lần cùng lúc

        set({ isRefreshing: true });
        try {
            const res = await api.post("/auth/refresh-token", {}, { withCredentials: true });
            const newAccessToken = res.data?.accessToken;

            if (newAccessToken) {
                set({ accessToken: newAccessToken });
                api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                toast.success("Token refreshed!");
            }
        } catch (error) {
            console.log("Error refreshing token:", error);
        } finally {
            set({ isRefreshing: false });
        }
    },

    // Kiểm tra Auth khi reload
    checkAuth: async () => {
        try {
            const res = await api.get("/auth/me");
            set({ authUser: res.data.user });
        } catch {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // Đăng ký
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            if (data.password !== data.confirmPassword) {
                toast.error("Passwords do not match. Please check again.");
                return;
            }

            const res = await api.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully!");
        } catch (error) {
            console.log("Error in signup:", error);
            const message = error?.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    // Đăng nhập
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await api.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully!");
        } catch (error) {
            console.log("Error in login:", error);
            const message = error?.response?.data?.message || "Something went wrong";
            toast.error(message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // Đăng nhập bằng Google
    loginWithGoogle: () => {
        window.location.href = "http://localhost:3000/api/auth/google";
    },

    // Đăng xuất
    logout: async () => {
        try {
            const res = await api.post("/auth/logout");
            set({ authUser: null });
            toast.success(res?.data?.message || "Logged out successfully");
        } catch (error) {
            console.log("Error in logout:", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    },

    // Gửi mã reset password
    forgotPassword: async () => {
        const { formData } = get();
        if (!formData.email) {
            toast.error("Please enter your email");
            return;
        }

        set({ isLoading: true });
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
            set({ isLoading: false });
        }
    },

    // Xác minh mã
    verifyResetCode: async () => {
        const { formData } = get();

        if (!formData.code) {
            toast.error("Please enter the verification code");
            return;
        }

        set({ isLoading: true });
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
            set({ isLoading: false });
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

        set({ isLoading: true });
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
            set({ isLoading: false });
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
