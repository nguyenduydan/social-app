import { api } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";


export const useAuthStore = create((set,) => ({
    authUser: null, //data user
    isCheckingAuth: true, // checking login
    isSigningUp: false,
    isLoggingIn: false,

    checkAuth: async () => {
        try {
            const res = await api.get("/auth/me");
            set({ authUser: res.data.user });
            toast.success(`Welcome back, ${res.data.user?.displayName || "User"}!`);
        } catch {
            set({ authUser: null });
            toast.error("Unauthorized - Please login");
        } finally {
            set({ isCheckingAuth: false });
        }
    },


    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            if (data.password !== data.confirmPassword) {
                return toast.error("Passwords do not match. Please check again.");
            }

            const res = await api.post("/auth/signup", data);
            set({ authUser: res.data });

            toast.success("Created account successful!");
        } catch (error) {
            console.log("Error in register:", error);
            const message = error?.response?.data?.message || "Something went wrong";

            toast.error(message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: false });
        try {
            const res = await api.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successful!");
        } catch (error) {
            console.log("Error in login:", error);
            const message = error?.response?.data?.message || "Something went wrong";

            toast.error(message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    loginWithGoogle: () => {
        window.location.href = "http://localhost:3000/api/auth/google";
    },

    logout: async () => {
        try {
            const res = await api.post("/auth/logout");
            set({ authUser: null });

            toast.success(res?.data?.message);
        } catch (error) {
            console.log("Error in logout: ", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    },

}));
