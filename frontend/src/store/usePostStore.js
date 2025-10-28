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
    setLoadingMore: (value) => set({ loadingMore: value }),

    fetchPosts: async (page = 1, append = false) => {
        try {
            if (append) {
                // Bật trạng thái load more ngay lập tức để UI hiện skeleton
                set({ loadingMore: true });

                // Thêm delay nhỏ (giúp skeleton có thời gian hiển thị)
                await new Promise((resolve) => setTimeout(resolve, 400));
            } else {
                set({ loading: true });
            }

            const res = await postService.getAll(page);
            const postsArray = Array.isArray(res.posts) ? res.posts : [];

            set((state) => {
                let newPosts = [];

                if (append) {
                    // Chỉ thêm bài mới chưa có trong danh sách hiện tại
                    const existingIds = new Set(state.posts.map((p) => p._id));
                    const freshPosts = postsArray.filter((p) => !existingIds.has(p._id));
                    newPosts = [...state.posts, ...freshPosts];
                } else {
                    newPosts = postsArray;
                }

                return {
                    posts: newPosts,
                    pagination: res.pagination || {},
                };
            });
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

    getPostsByUserId: async (userId, page = 1, append = false) => {
        try {
            if (append) {
                set({ loadingMore: true });
            } else {
                set({ loading: true });
            }

            const res = await postService.getPostsByUserId(userId, page);
            const postsArray = Array.isArray(res.posts) ? res.posts : [];

            set((state) => {
                // Nối bài cũ + mới nếu append, ngược lại thì reset
                const combined = append ? [...state.posts, ...postsArray] : postsArray;

                // Lọc trùng theo _id
                const uniquePosts = combined.filter(
                    (p, index, self) => index === self.findIndex((t) => t._id === p._id)
                );

                return {
                    posts: uniquePosts,
                    pagination: res.pagination || {},
                };
            });
        } catch (error) {
            console.error("Error in fetchPosts:", error);
            toast.error("Không thể tải bài viết!");
        } finally {
            set({ loading: false, loadingMore: false });
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

    updateVisibility: async ({ postId, visibility }) => {
        try {
            set({ updatingPost: true });
            await postService.updatePostVisibility(postId, visibility);
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

        toast.promise(promise, {
            loading: "Đang xóa bài viết...",
            success: "Đã xóa bài viết!",
            error: "Xóa bài viết không thành công!",
        });
    },

}));
