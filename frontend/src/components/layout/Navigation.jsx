import NavLink from "./NavLink";
import routes from "@/routes";
import { useScrollStatus } from "@/hooks/useScrollStatus";

const Navigation = () => {
    const { isScrolling } = useScrollStatus(500);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 ease-out ${isScrolling ? "scale-50 -bottom-4 " : "scale-100 bottom-2 "} }`}
        >
            <div className="flex justify-center mx-auto z-10 ">
                <div className=" bg-white/10 backdrop-blur-sm py-2 dark:bg-black/10 brightness-125 rounded-full w-xs md:w-lg border-y-2 border-white dark:border-b-white transition-all duration-300 ease-out shadow-[0_0_5px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center justify-center rounded-full ">
                        <div className="flex items-center space-x-4 md:space-x-5">
                            {routes.map((item, idx) => (
                                <NavLink
                                    key={idx}
                                    item={item}
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
