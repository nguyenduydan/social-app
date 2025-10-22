import { Link, useLocation } from "react-router";
import { useScrollRef } from "@/contexts/ScrollContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const NavLink = ({ item }) => {
    const location = useLocation();
    const scrollRef = useScrollRef();
    const isActive = location.pathname === item.path;

    // Sử dụng hook để thêm tính năng scroll to top
    useScrollToTop({ scrollRef });

    const handleClick = (e) => {
        // Nếu đã active, scroll về top thay vì navigate
        if (isActive) {
            e.preventDefault(); // Ngăn navigation
            if (scrollRef.current) {
                scrollRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }
        // Nếu không active, để Link navigate bình thường
    };

    return (
        <Link
            to={item.path}
            onClick={handleClick}
            className={`
                relative flex w-15 h-10 md:w-12 md:h-12 my-1 justify-center items-center
                rounded-full cursor-pointer transition-all duration-300 ease-out
                ${isActive
                    ? `
                        bg-primary-glow dark:bg-primary-glow
                        text-secondary font-semibold
                        shadow-[0_0_5px_0px_rgba(0,0,0,0.3)]
                        dark:shadow-[0_0_5px_0px_rgba(0,0,0,0.3)]
                        scale-110
                      `
                    : `
                        text-foreground/50 dark:text-foreground/80
                        hover:text-foreground hover:bg-secondary/30 dark:hover:bg-muted/60
                        hover:shadow-[0_0_5px_0px_rgba(0,0,0,0.3)]
                        hover:scale-105 active:scale-75
                      `
                }
            `}
        >
            {item.icon}
        </Link>
    );
};

export default NavLink;
