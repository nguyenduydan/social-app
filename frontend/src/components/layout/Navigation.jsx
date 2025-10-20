import NavLink from "./NavLink";
import routes from "@/routes";

const Navigation = () => {

    return (
        <nav
            className={`fixed w-full z-50 bottom-2 transition-all duration-500 ease-out}`}
        >
            <div className="flex justify-center mx-auto z-10">
                <div className="py-3 bg-black/20 dark:bg-black/40 backdrop-blur-5xl brightness-125 rounded-3xl w-xs border-b-2 border-white border-t-2 dark:border-b-white transition-all duration-500 ease-in-out">
                    <div className="flex items-center justify-center bg-transparent rounded-full">
                        <div className="flex items-center space-x-5">
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
