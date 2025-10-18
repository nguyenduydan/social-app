import { useEffect, useState } from "react";
import NavLink from "./NavLink";
import routes from "@/routes";

const Navigation = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        let scrollTimeout;

        const handleScroll = () => {
            setIsScrolling(true);

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    const scrollToSection = (href) => {
        const el = document.querySelector(href);
        if (el) {
            const navHeight = 60;
            const elementPos = el.offsetTop - navHeight;
            window.scrollTo({
                top: elementPos,
                behavior: "smooth",
            });
        }
    };

    const handleNavClick = (href, idx) => {
        setActiveIndex(idx);
        scrollToSection(href);
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ease-out ${isScrolling ? "-bottom-20" : "bottom-2"
                }`}
        >
            <div className="flex justify-center mx-auto z-10">
                <div className="py-3 bg-black/10 backdrop-blur-2xl dark:backdrop-blur-4xl rounded-3xl w-xs border-b-2 border-white border-t-2 dark:border-b-white transition-all duration-500 ease-in-out">
                    <div className="flex items-center justify-center bg-transparent rounded-full">
                        <div className="flex items-center space-x-5">
                            {routes.map((item, idx) => (
                                <NavLink
                                    key={idx}
                                    item={item}
                                    isActive={activeIndex === idx}
                                    onNavigate={() => handleNavClick(item.href, idx)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
