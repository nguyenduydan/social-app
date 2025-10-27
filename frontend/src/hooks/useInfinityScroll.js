import { useEffect, useRef } from "react";

/**
 * Custom hook để tự động gọi callback khi scroll tới cuối danh sách
 * @param {Function} callback - Hàm được gọi khi chạm vùng quan sát
 * @param {boolean} canLoadMore - Điều kiện cho phép gọi thêm (vd: hasNextPage)
 * @param {boolean} loading - Tránh gọi liên tục khi đang tải
 * @param {object} options - Tuỳ chỉnh IntersectionObserver (threshold, rootMargin,...)
 * @returns {object} { lastElementRef }
 */
export const useInfiniteScroll = (
    callback,
    canLoadMore,
    loading,
    options = {}
) => {
    const observer = useRef(null);
    const lastElementRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (!canLoadMore || loading) return;

        const el = lastElementRef.current;
        if (!el) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting) {
                    // 👇 debounce 300ms để tránh gọi liên tục
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => {
                        callback();
                    }, 300);
                }
            },
            {
                root: options.root || null,
                rootMargin: options.rootMargin || "300px",
                threshold: options.threshold || 0.1,
            }
        );

        observer.current.observe(el);

        return () => {
            if (observer.current && el) observer.current.unobserve(el);
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [callback, canLoadMore, loading, options.root, options.rootMargin, options.threshold]);

    return { lastElementRef };
};
