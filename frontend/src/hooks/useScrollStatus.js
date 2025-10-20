import { useEffect, useState, useRef } from "react";

/**
 * Hook theo dõi trạng thái cuộn (scroll)
 * @param {React.RefObject|null} scrollRef - Phần tử cuộn (hoặc window)
 * @param {number} threshold - Khoảng cách tối thiểu để tính là đổi hướng (px)
 * @param {number} idleDelay - Thời gian chờ để xem là ngừng cuộn (ms)
 * @returns {{ isScrollingDown: boolean, isScrollingUp: boolean, scrollY: number, isAtTop: boolean, isAtBottom: boolean, isScrolling: boolean }}
 */
export const useScrollStatus = (scrollRef = null, threshold = 10, idleDelay = 150) => {
    const [scrollY, setScrollY] = useState(0);
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    const lastScrollY = useRef(0);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const element = scrollRef?.current || window;

        const handleScroll = () => {
            const currentY = scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY;

            setScrollY(currentY);
            setIsScrolling(true);

            const diff = currentY - lastScrollY.current;

            // Đổi hướng khi vượt qua threshold
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    setIsScrollingDown(true);
                    setIsScrollingUp(false);
                } else {
                    setIsScrollingUp(true);
                    setIsScrollingDown(false);
                }
                lastScrollY.current = currentY;
            }

            // Reset timeout để phát hiện dừng cuộn
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
                setIsScrollingDown(false);
                setIsScrollingUp(false);
            }, idleDelay);
        };

        element.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            element.removeEventListener("scroll", handleScroll);
            clearTimeout(timeoutRef.current);
        };
    }, [scrollRef, threshold, idleDelay]);

    // Kiểm tra chạm đỉnh hoặc đáy
    const isAtTop = scrollY < 50;
    const isAtBottom = scrollRef?.current
        ? scrollY + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight - 10
        : false;

    return {
        isScrollingDown,
        isScrollingUp,
        scrollY,
        isAtTop,
        isAtBottom,
        isScrolling,
    };
};
