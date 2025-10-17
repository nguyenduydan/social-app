import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react';

const Home = () => {
    const { logout } = useAuthStore();
    return (
        <div>
            <Navbar />
            Home
            <Button className="mt-20" onClick={logout}>
                Logout
            </Button>
        </div>
    );
};

export default Home;
