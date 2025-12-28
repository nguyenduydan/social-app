import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Navigation = () => {
    return (
        <>
            {/* Desktop - Left Sidebar */}
            <div className="hidden md:flex">
                <DesktopNav />
            </div>

            {/* Mobile - Bottom Bar */}
            <div className="md:hidden w-full">
                <MobileNav />
            </div>
        </>
    );
};

export default Navigation;
