import { useEffect } from "react";

/**
 * Cuộn vùng chỉ định (hoặc trang) lên đầu mỗi khi deps thay đổi.
 * @param {object} options
 * @param {React.RefObject<HTMLElement>} options.scrollRef - phần tử cần cuộn (tùy chọn)
 * @param {any[]} [options.deps=[]] - dependency array để trigger scroll
 * @param {boolean} [options.smooth=true] - có scroll mượt hay không
 */
export const useScrollToTop = ({ scrollRef, deps = [], smooth = true }) => {
    useEffect(() => {
        const behavior = smooth ? "smooth" : "auto";

        if (scrollRef?.current) {
            scrollRef.current.scrollTo({ top: 0, behavior });
        } else {
            window.scrollTo({ top: 0, behavior });
        }
    }, deps); // deps để trigger mỗi khi thay đổi
};
