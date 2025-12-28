import { Outlet } from 'react-router';
import DesktopNav from '../navigation/DesktopNav';
import MobileNav from '../navigation/MobileNav';
import { useScrollRef } from '@/contexts/ScrollContext';

const MainLayout = () => {
    const scrollRef = useScrollRef();

    return (
        <div className="fixed inset-0 flex flex-col lg:flex-row bg-background">
            {/* LEFT SIDEBAR - Desktop Only */}
            <aside className="hidden lg:flex lg:w-64 2xl:w-72 lg:flex-col lg:border-r lg:border-border/50 lg:bg-background/95 lg:backdrop-blur-md flex-shrink-0 overflow-hidden">
                <DesktopNav />
            </aside>

            {/* MAIN CONTENT AREA */}
            <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-hide flex flex-col h-full w-full pb-20 lg:pb-0"
            >
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-sm">
                <MobileNav />
            </div>
        </div>
    );
};

export default MainLayout;
