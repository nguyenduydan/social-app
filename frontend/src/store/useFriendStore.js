import { friendService } from "@/services/friendService";
import { toast } from "sonner";
import { create } from "zustand";

export const useFriendStore = create((set) => ({
    friends: [],
    requests: [],
    suggestions: [],
    friendStatus: "none",
    friendshipId: null,
    isRequester: false,
    loading: false,
    loadingMore: false,
    isProcessing: false,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
    },

    // Kiểm tra trạng thái bạn bè
    checkFriendStatus: async (userId) => {
        try {
            const res = await friendService.checkFriend(userId);
            set({
                friendStatus: res?.status || "none",
                friendshipId: res?.requestId || null,
                isRequester: res?.isRequester || false,
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể kiểm tra trạng thái bạn bè");
            set({ friendStatus: "none", friendshipId: null, isRequester: false });
        }
    },

    // Danh sách bạn bè (phân trang)
    getFriendAll: async (page = 1, append = false, limit = 10) => {
        try {
            if (append) set({ loadingMore: true });
            else set({ loading: true });

            const res = await friendService.getFriendAll(page, limit);
            const friendsArray = Array.isArray(res.friends) ? res.friends : [];

            set((state) => ({
                friends: append
                    ? [
                        ...state.friends,
                        ...friendsArray.filter((f) => !state.friends.some((x) => x._id === f._id)),
                    ]
                    : friendsArray,
                pagination: res.pagination || state.pagination,
            }));
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể tải danh sách bạn bè");
        } finally {
            set({ loading: false, loadingMore: false });
        }
    },

    // Danh sách lời mời kết bạn
    getRequests: async (type = "received", page = 1, append = false, limit = 10) => {
        try {
            if (append) set({ loadingMore: true });
            else set({ loading: true });

            const res = await friendService.getFriendRequests(page, limit, type);
            const requestsArray = Array.isArray(res.friendRequests) ? res.friendRequests : [];

            set((state) => ({
                requests: append
                    ? [
                        ...state.requests,
                        ...requestsArray.filter((r) => !state.requests.some((x) => x.requestId === r.requestId)),
                    ]
                    : requestsArray,
                pagination: res.pagination || state.pagination,
            }));
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể tải lời mời kết bạn");
        } finally {
            set({ loading: false, loadingMore: false });
        }
    },

    // Gợi ý kết bạn (basic)
    getSuggestions: async (limit = 10) => {
        try {
            set({ loading: true });
            const res = await friendService.getFriendSuggestions(limit);
            const suggestions = Array.isArray(res.suggestions)
                ? res.suggestions.sort(() => 0.5 - Math.random()).slice(0, 10)
                : [];
            set({ suggestions });
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể tải gợi ý kết bạn");
        } finally {
            set({ loading: false });
        }
    },

    // Gửi lời mời kết bạn
    sendFriendRequest: async (userId, message = "") => {
        set({ loading: true });
        try {
            const res = await friendService.sendRequest(userId, message);
            set({
                friendshipId: res?.request?._id,
                friendStatus: "pending",
                isRequester: true,
            });
            toast.success("Đã gửi lời mời kết bạn");
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể gửi lời mời kết bạn");
        } finally {
            set({ loading: false });
        }
    },

    // Chấp nhận lời mời
    acceptFriendRequest: async (requestId) => {
        set({ isProcessing: true });
        try {
            await friendService.acceptRequest(requestId);
            set({ friendStatus: "accepted" });
            toast.success("Đã chấp nhận lời mời kết bạn");
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể chấp nhận lời mời");
        } finally {
            set({ isProcessing: false });
        }
    },

    // Từ chối lời mời
    rejectFriendRequest: async (requestId) => {
        set({ isProcessing: true });
        try {
            await friendService.rejectRequest(requestId);
            set({ friendStatus: "none" });
            toast.success("Đã từ chối lời mời kết bạn");
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể từ chối lời mời");
        } finally {
            set({ isProcessing: false });
        }
    },

    // Hủy lời mời đã gửi
    cancelFriendRequest: async (requestId) => {
        set({ loading: true });
        try {
            await friendService.cancelRequest(requestId);
            set({ friendStatus: "none", friendshipId: null });
            toast.success("Đã hủy lời mời kết bạn");
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể hủy lời mời kết bạn");
        } finally {
            set({ loading: false });
        }
    },

    // Hủy kết bạn (đã là bạn bè)
    unfriend: async (friendshipId) => {
        set({ loading: true });
        try {
            await friendService.removeFriend(friendshipId);
            set({ friendStatus: "none", friendshipId: null });
            toast.success("Đã hủy kết bạn");
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể hủy kết bạn");
        } finally {
            set({ loading: false });
        }
    },
}));
