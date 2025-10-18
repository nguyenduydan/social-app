import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router';
import Navigation from './Navigation';

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <Navigation />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
