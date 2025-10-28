import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

const Navigation = () => {
    return (
        <>
            {/* Desktop */}
            <div className="hidden md:block">
                <DesktopNav />
            </div>

            {/* Mobile */}
            <div className="md:hidden">
                <MobileNav />
            </div>
        </>
    );
};

export default Navigation;
