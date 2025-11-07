import { useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for handling load more functionality with debouncing
 * @param {Function} fetchFn - Function to fetch more data
 * @param {Object} pagination - Pagination object with hasNextPage and currentPage
 * @param {boolean} loading - Loading state
 * @param {boolean} loadingMore - Loading more state
 * @param {Function} setLoadingMore - Function to set loading more state
 * @param {Object} options - Additional options
 * @param {number} options.delay - Debounce delay in milliseconds (default: 350)
 * @param {Array} options.additionalArgs - Additional arguments to pass to fetchFn before page number
 * @returns {Function} loadMore - Function to trigger loading more data
 */
export const useLoadMore = (
    fetchFn,
    pagination,
    loading,
    loadingMore,
    setLoadingMore,
    options = {}
) => {
    const { delay = 350, additionalArgs = [] } = options;
    const delayRef = useRef(null);

    const loadMore = useCallback(() => {
        if (pagination.hasNextPage && !loading && !loadingMore) {
            setLoadingMore(true);

            clearTimeout(delayRef.current);
            delayRef.current = setTimeout(async () => {
                try {
                    await fetchFn(...additionalArgs, pagination.currentPage + 1, true);
                } finally {
                    setLoadingMore(false);
                }
            }, delay);
        }
    }, [pagination, loading, loadingMore, fetchFn, setLoadingMore, delay, additionalArgs]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => clearTimeout(delayRef.current);
    }, []);

    return loadMore;
};
