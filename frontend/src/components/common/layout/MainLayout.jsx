import { Outlet } from 'react-router';
import Navigation from '../navigation/Navigation';
import { useScrollRef } from '@/contexts/ScrollContext';

const MainLayout = () => {
    const scrollRef = useScrollRef();

    return (
        <div className="fixed inset-0 flex flex-col">
            <Navigation />
            <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto scrollbar-hide"
            >
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
