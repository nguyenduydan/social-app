import { compressImage } from "@/lib/compressMedia";
import { postService } from "@/services/postService";
import { toast } from "sonner";
import { create } from "zustand";

export const usePostStore = create((set, get) => ({
    posts: [],
    post: null,
    loading: false,
    loadingMore: false,
    creatingPost: false,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
    },

    fetchPosts: async (page = 1, append = false) => {
        try {
            if (append) {
                set({ loadingMore: true });
            } else {
                set({ loading: true });
            }

            const res = await postService.getAll(page);
            const postsArray = Array.isArray(res.posts) ? res.posts : [];

            set((state) => ({
                posts: append ? [...state.posts, ...postsArray] : postsArray,
                pagination: res.pagination || {},
            }));
        } catch (error) {
            console.error("Error in fetchPosts:", error);
            toast.error("Không thể tải bài viết!");
        } finally {
            set({ loading: false, loadingMore: false });
        }
    },

    createPost: async (data) => {
        try {
            set({ creatingPost: true });
            const { content, media = [], visibility } = data;

            const formData = new FormData();
            formData.append("content", content || "");
            formData.append("visibility", visibility || "public");

            // Nén ảnh ở FE trước khi gửi
            for (const item of media) {
                let file = item.file instanceof File ? item.file : item;
                if (!file) continue;

                if (file.type.startsWith("image/")) {
                    file = await compressImage(file);
                }

                formData.append("media", file);
            }

            // Gửi đến API
            await postService.create(formData);
            await get().fetchPosts(); // refresh lại danh sách
            toast.success("Tạo bài viết thành công!");
        } catch (error) {
            console.error("❌ Lỗi createPost:", error);
            toast.error("Tạo bài viết thất bại!");
        } finally {
            set({ creatingPost: false });
        }
    },

    getPostById: async (postId) => {
        try {
            const postDetail = postService.getById(postId);
            set({ post: postDetail });
        } catch (error) {
            console.error("Error in getPostById:", error);
            toast.error("Lấy bài viết không thành công!");
        }
    },

    deletePost: async (postId) => {
        try {
            await postService.delete(postId);
            await get().fetchPosts(); // refresh lại danh sách
            toast.success("Đã xóa bài viết!");
        } catch (error) {
            console.error("Error in deletePost:", error);
            toast.error("Xóa bài viết không thành công!");
        }
    }
}));
