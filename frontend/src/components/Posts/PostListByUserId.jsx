import { useInfiniteScroll } from '@/hooks/useInfinityScroll';
import { usePostStore } from '@/store/usePostStore';
import React, { useCallback, useEffect } from 'react';
import PostCard from "./PostCard";
import FeedCardSkeleton from './SkeletonPostCard';

const PostListById = ({ user }) => {
    const { getPostsByUserId, posts, loading, loadingMore, pagination } = usePostStore();

    useEffect(() => {
        if (user?._id) {
            getPostsByUserId(user._id, 1);
        }
    }, [getPostsByUserId, user?._id]);

    const loadMore = useCallback(() => {
        if (pagination.hasNextPage && !loadingMore && !loading) {
            getPostsByUserId(user._id, pagination.currentPage + 1, true);
        }
    }, [pagination, loading, loadingMore, getPostsByUserId, user._id]);

    const { lastElementRef } = useInfiniteScroll(
        loadMore,
        pagination.hasNextPage,
        loading,
        { rootMargin: "500px" }
    );

    // Loading UI - Initial load
    if (loading && posts.length === 0) {
        return (
            <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                    <FeedCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4 min-h-[400px] w-full">
            {Array.isArray(posts) && posts.length > 0 ? (
                <>
                    {posts.map((post, idx) => (
                        <div
                            key={post._id}
                            ref={idx === posts.length - 1 ? lastElementRef : null}
                            className="animate-in fade-in duration-300"
                        >
                            <PostCard post={post} />
                        </div>
                    ))}

                    {/* Loading more skeleton - smooth transition */}
                    {loadingMore && (
                        <div className="space-y-4">
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

export default PostListById;
