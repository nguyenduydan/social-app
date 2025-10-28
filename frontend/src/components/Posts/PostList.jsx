import { useCallback, useEffect, useRef } from "react";
import { usePostStore } from "@/store/usePostStore";
import PostCard from "./PostCard";
import FeedCardSkeleton from "./SkeletonPostCard";
import { useInfiniteScroll } from "@/hooks/useInfinityScroll";

const PostList = () => {
    const { fetchPosts, posts, loading, loadingMore, pagination, setLoadingMore } = usePostStore();
    const delayRef = useRef(null);

    // Load trang đầu tiên
    useEffect(() => {
        fetchPosts(1);
        return () => clearTimeout(delayRef.current);
    }, [fetchPosts]);

    // Load thêm khi cuộn xuống
    const loadMore = useCallback(() => {
        if (pagination.hasNextPage && !loading && !loadingMore) {
            setLoadingMore(true);

            clearTimeout(delayRef.current);
            delayRef.current = setTimeout(async () => {
                try {
                    await fetchPosts(pagination.currentPage + 1, true);
                } finally {
                    // Đảm bảo loadingMore luôn được tắt
                    setLoadingMore(false);
                }
            }, 400); // Delay nhẹ để skeleton hiển thị mượt
        }
    }, [pagination, loading, loadingMore, fetchPosts, setLoadingMore]);

    // Kích hoạt infinite scroll
    const { lastElementRef } = useInfiniteScroll(loadMore, pagination.hasNextPage, loading, {
        rootMargin: window.innerWidth < 768 ? "1000px" : "800px",
    });

    // 🔹 Loading ban đầu
    if (loading && posts.length === 0) {
        return (
            <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                    <FeedCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // 🔹 Danh sách bài viết
    return (
        <div className="space-y-4 min-h-[400px]">
            {Array.isArray(posts) && posts.length > 0 ? (
                <>
                    {posts.map((post, idx) => (
                        <div
                            key={post._id}
                            ref={idx === posts.length - 1 ? lastElementRef : null}
                            className="animate-in fade-in duration-300 will-change-transform"
                        >
                            <PostCard post={post} />
                        </div>
                    ))}

                    {/* 🔹 Skeleton hiển thị khi load thêm */}
                    {loadingMore && (
                        <div className="space-y-4 transition-opacity duration-300">
                            {[...Array(2)].map((_, i) => (
                                <div
                                    key={`loading-more-${i}`}
                                    className="animate-in fade-in duration-200"
                                >
                                    <FeedCardSkeleton />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-gray-500 py-10">
                    Chưa có bài viết nào.
                </div>
            )}
        </div>
    );
};

export default PostList;
