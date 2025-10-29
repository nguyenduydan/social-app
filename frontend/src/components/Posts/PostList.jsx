import { useCallback, useEffect, useMemo, useRef } from "react";
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
                    setLoadingMore(false);
                }
            }, 350);
        }
    }, [pagination, loading, loadingMore, fetchPosts, setLoadingMore]);

    // Luôn khai báo hook trước mọi return
    const { lastElementRef } = useInfiniteScroll(loadMore, pagination.hasNextPage, loading, {
        rootMargin: window.innerWidth < 768 ? "1200px" : "900px",
    });

    const renderedPosts = useMemo(() => {
        return posts.map((post, idx) => (
            <div
                key={post._id}
                ref={idx === posts.length - 1 ? lastElementRef : null}
                className="animate-in fade-in duration-300 will-change-transform"
            >
                <PostCard post={post} />
            </div>
        ));
    }, [posts, lastElementRef]);

    // Giữ return 1 chỗ duy nhất
    return (
        <div className="space-y-4 min-h-[400px]">
            {loading && posts.length === 0 ? (
                // Hiển thị skeleton khi load lần đầu
                <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                        <FeedCardSkeleton key={i} />
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <>
                    {renderedPosts}

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
