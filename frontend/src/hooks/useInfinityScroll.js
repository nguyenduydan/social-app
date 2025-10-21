import { useEffect, useRef } from "react";

/**
 * Custom hook để tự động gọi callback khi scroll tới cuối danh sách
 * @param {Function} callback - Hàm được gọi khi chạm vùng quan sát
 * @param {boolean} canLoadMore - Điều kiện cho phép gọi thêm (vd: hasNextPage)
 * @param {boolean} loading - Tránh gọi liên tục khi đang tải
 * @param {object} options - Tuỳ chỉnh IntersectionObserver (threshold, rootMargin,...)
 * @returns {object} { lastElementRef }
 */
export const useInfiniteScroll = (callback, canLoadMore, loading, options = {}) => {
    const observer = useRef(null);
    const lastElementRef = useRef(null);

    useEffect(() => {
        if (!canLoadMore || loading) return;

        const el = lastElementRef.current;
        if (!el) return;

        observer.current = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    callback(); // Gọi API load thêm
                }
            },
            {
                root: options.root || null,
                rootMargin: options.rootMargin || "0px",
                threshold: options.threshold || 1.0,
            }
        );

        observer.current.observe(el);

        return () => {
            if (observer.current && el) {
                observer.current.unobserve(el);
            }
        };
    }, [callback, canLoadMore, loading]);

    return { lastElementRef };
};
