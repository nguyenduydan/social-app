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
    updatingPost: false,
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
            const postDetail = await postService.getById(postId);
            set({ post: postDetail });
        } catch (error) {
            console.error("Error in getPostById:", error);
            toast.error("Lấy bài viết không thành công!");
        }
    },

    updatePost: async ({ postId, data }) => {
        try {
            set({ updatingPost: true });

            const { content, visibility, existingMedia = [], newMedia = [] } = data;

            const formData = new FormData();
            formData.append("content", content || "");
            formData.append("visibility", visibility || "public");

            // Gửi danh sách media cũ (ID) để BE biết giữ lại
            existingMedia.forEach((m) => {
                if (m.id) formData.append("existingMedia[]", m.id);
            });

            // Nén ảnh mới (nếu có)
            for (const item of newMedia) {
                let file = item.file instanceof File ? item.file : item;
                if (!file) continue;

                if (file.type.startsWith("image/")) {
                    file = await compressImage(file);
                }

                formData.append("media", file);
            }

            // Gửi lên API
            await postService.update({ postId, formData });;

            // Refresh lại danh sách bài viết
            await get().fetchPosts();

            toast.success("Cập nhật bài viết thành công!");
        } catch (error) {
            console.error("Lỗi updatePost:", error);
            toast.error("Cập nhật bài viết thất bại!");
        } finally {
            set({ updatingPost: false });
        }
    },

    deletePost: async (postId) => {
        const promise = (async () => {
            await postService.delete(postId);
            await get().fetchPosts(); // refresh lại danh sách
        })();

        await toast.promise(promise, {
            loading: "Đang xóa bài viết...",
            success: "Đã xóa bài viết!",
            error: "Xóa bài viết không thành công!",
        });
    },

}));
