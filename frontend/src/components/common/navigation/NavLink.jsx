import { Link, useLocation } from "react-router";
import { useScrollRef } from "@/contexts/ScrollContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { cn } from "@/lib/utils";

const NavLink = ({ item, isSidebar, isActive: propsIsActive }) => {
    const location = useLocation();
    const scrollRef = useScrollRef();
    const isActive = propsIsActive !== undefined ? propsIsActive : location.pathname === item.path;

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
            className={cn(
                "relative flex items-center cursor-pointer transition-colors duration-200 select-none rounded-lg",
                isSidebar ? "w-full px-4 py-3 gap-3 justify-start" : "my-1 px-2 lg:px-4 h-10 justify-center gap-2",
                isActive
                    ? "text-green-600 dark:text-green-400 font-semibold z-10 relative"
                    : "text-foreground/60 dark:text-foreground/70 hover:text-foreground hover:bg-secondary/30 dark:hover:bg-muted/50",
            )}
        >
            <div className={cn(
                "transition-colors duration-200 flex-shrink-0 relative z-10",
                isActive && "text-green-600 dark:text-green-400"
            )}>
                {item.icon}
            </div>

            {/* Label */}
            <span
                className={cn(
                    "text-sm font-medium whitespace-nowrap transition-all duration-300 relative z-10",
                    isSidebar ? "inline-block" : "hidden lg:inline-block",
                    isActive ? "text-green-600 dark:text-green-400" : "text-foreground/70"
                )}
            >
                {item.name}
            </span>
        </Link>
    );
};


export default NavLink;
