import { useEffect, useState } from "react";

/**
 * Custom hook to track whether the user is currently scrolling.
 * Returns: { isScrolling: boolean, scrollY: number }
 */
export const useScrollStatus = (delay = 400) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollY, setScrollY] = useState(window.scrollY);

    useEffect(() => {
        let scrollTimeout;

        const handleScroll = () => {
            setIsScrolling(true);
            setScrollY(window.scrollY);

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, delay);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, [delay]);

    return { isScrolling, scrollY };
};
