import { useCallback, useEffect } from "react";
import { usePostStore } from "@/store/usePostStore";
import PostCard from "./PostCard";
import FeedCardSkeleton from "./SkeletonPostCard";
import { useInfiniteScroll } from "@/hooks/useInfinityScroll";

const PostList = () => {
    const { fetchPosts, posts, loading, loadingMore, pagination } = usePostStore();

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    const loadMore = useCallback(() => {
        if (pagination.hasNextPage && !loadingMore && !loading) {
            fetchPosts(pagination.currentPage + 1, true);
        }
    }, [pagination, loading, loadingMore, fetchPosts]);

    const { lastElementRef } = useInfiniteScroll(loadMore, pagination.hasNextPage, loading);

    // Loading UI
    if (loading) {
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <FeedCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    // Danh sách bài viết
    return (
        <div className="space-y-4 ">
            {Array.isArray(posts) && posts.length > 0 ? (
                posts.map((post, idx) => (
                    <div
                        key={idx}
                        ref={idx === posts.length - 1 ? lastElementRef : null}
                    >
                        <PostCard post={post} />
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 py-10">Chưa có bài viết nào.</div>
            )}
            {loadingMore && (
                <div className="space-y-4 mt-4">
                    {[...Array(4)].map((_, i) => (
                        <FeedCardSkeleton key={`loading-more-${i}`} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
