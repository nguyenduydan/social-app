import { Link, useLocation } from "react-router";
import { useScrollRef } from "@/contexts/ScrollContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { cn } from "@/lib/utils";

const NavLink = ({ item, isAtTop }) => {
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
            className={cn(
                "relative flex my-1 items-center justify-center cursor-pointer transition-all duration-300 ease-out select-none",
                isActive
                    ? "bg-primary-glow dark:bg-primary-glow text-secondary font-semibold shadow-[0_0_6px_rgba(0,0,0,0.3)] dark:shadow-[0_0_6px_rgba(255,255,255,0.1)] scale-105"
                    : "text-foreground/60 dark:text-foreground/70 hover:text-foreground hover:bg-secondary/30 dark:hover:bg-muted/50 hover:shadow-[0_0_5px_rgba(0,0,0,0.25)] hover:scale-105 active:scale-90",
                isAtTop ? "px-2 lg:px-4 h-10 rounded-xl" : "px-2 w-10 h-10 md:w-12 md:h-12 rounded-full"
            )}
        >
            <div className="flex items-center gap-2 px-2">
                {/* Icon */}
                <div className={cn(
                    "transition-transform duration-300 ease-out",
                    isActive && "scale-110"
                )}>
                    {item.icon}
                </div>

                {/* Label */}
                {isAtTop && (
                    <span
                        className={cn(
                            "hidden lg:inline-block text-sm font-medium whitespace-nowrap transition-all duration-300",
                            isActive ? "text-background" : "text-foreground/70"
                        )}
                    >
                        {item.name}
                    </span>
                )}
            </div>
        </Link>
    );
};


export default NavLink;
