import { useEffect, useState, useRef } from "react";

/**
 * Hook theo dõi trạng thái cuộn (scroll)
 * - Lưu lại lastDirection ('down' | 'up' | null') và không xóa khi idle
 * - Reset direction khi chạm top hoặc khi di chuyển ngược lại vượt threshold
 */
export const useScrollStatus = (scrollRef = null, threshold = 10, idleDelay = 150) => {
    const [scrollY, setScrollY] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    // public booleans derived from lastDirection
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [isScrollingUp, setIsScrollingUp] = useState(false);

    const lastScrollY = useRef(0);
    const lastDirection = useRef(null); // 'down' | 'up' | null
    const timeoutRef = useRef(null);

    useEffect(() => {
        const element = scrollRef?.current || window;

        if (!element) return;

        const getY = () => (scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY);

        const handleScroll = () => {
            const currentY = getY();
            const diff = currentY - lastScrollY.current;

            setScrollY(currentY);
            setIsScrolling(true);

            // only update when movement is significant
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // scrolling down
                    lastDirection.current = "down";
                    setIsScrollingDown(true);
                    setIsScrollingUp(false);
                } else {
                    // scrolling up
                    lastDirection.current = "up";
                    setIsScrollingUp(true);
                    setIsScrollingDown(false);
                }
                lastScrollY.current = currentY;
            }

            // reset idle timer: only set isScrolling false on idle, keep lastDirection
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsScrolling(false);
                // keep isScrollingDown/up based on lastDirection
                setIsScrollingDown(lastDirection.current === "down");
                setIsScrollingUp(lastDirection.current === "up");
            }, idleDelay);
        };

        element.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            element.removeEventListener("scroll", handleScroll);
            clearTimeout(timeoutRef.current);
            // optional reset on unmount
            setIsScrolling(false);
            setIsScrollingDown(false);
            setIsScrollingUp(false);
            setScrollY(0);
            lastScrollY.current = 0;
            lastDirection.current = null;
        };
    }, [scrollRef, threshold, idleDelay]);

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
        // expose lastDirection if needed
        lastDirection: lastDirection.current,
    };
};
