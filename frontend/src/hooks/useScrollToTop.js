import { useEffect } from "react";


export const useScrollToTop = ({ scrollRef }) => {

    useEffect(() => {
        if (!scrollRef.current) return;

        const scrollElement = scrollRef.current;
        scrollElement.style.scrollBehavior = 'smooth';

        return () => {
            if (scrollElement) {
                scrollElement.style.scrollBehavior = 'auto';
            }
        };
    }, [scrollRef]);

    return useScrollToTop;
};
