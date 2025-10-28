import { friendService } from "@/services/friendService";
import { toast } from "sonner";
import { create } from "zustand";

export const useFriendStore = create((set) => ({
    friends: [],
    loading: false,
    loadingMore: false,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
    },
    hasMore: true,

    getFriendAll: async (page = 1) => {
        try {
            if (page === 1) set({ loading: true });
            else set({ loadingMore: true });

            const res = await friendService.getFriendAll(page);
            const { friends, pagination } = res; // ✅ backend trả về { friends, pagination }

            if (!Array.isArray(friends)) {
                throw new Error("Dữ liệu trả về không hợp lệ");
            }

            set((state) => ({
                friends:
                    page === 1
                        ? friends // load lần đầu
                        : [...state.friends, ...friends], // load thêm
                pagination,
            }));
        } catch (err) {
            console.error("Lỗi khi tải danh sách bạn bè:", err);
            toast.error(err.response?.data?.message || "Không thể tải danh sách bạn bè");
        } finally {
            set({ loading: false, loadingMore: false });
        }
    },
}));
