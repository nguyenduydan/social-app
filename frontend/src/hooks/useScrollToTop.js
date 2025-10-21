import { useEffect, useState } from "react";

export const useScrollToTop = (scrollRef, threshold = 300) => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const el = scrollRef?.current;
        if (!el) return;

        const handleScroll = () => {
            setShowScrollTop(el.scrollTop > threshold);
        };

        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [scrollRef, threshold]);

    return showScrollTop;
};
