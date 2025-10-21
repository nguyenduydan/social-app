import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router';
import Navigation from './Navigation';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useScrollRef } from '@/contexts/ScrollContext';
import ScrollToTop from '../common/ScrollToTop';

const MainLayout = () => {
    const scrollRef = useScrollRef();
    const showScrollTop = useScrollToTop(scrollRef);

    const handleScrollTop = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div>
            <Navbar />
            <Navigation />
            <main className="h-screen overflow-y-auto">
                <Outlet />
            </main>
            <ScrollToTop showScrollTop={showScrollTop} onScrollTop={handleScrollTop} />
        </div>
    );
};

export default MainLayout;
