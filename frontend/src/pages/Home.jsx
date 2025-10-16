import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react';

const Home = () => {
    const { logout } = useAuthStore();
    return (
        <div>
            Home
            <Button onClick={logout}>
                Logout
            </Button>
        </div>
    );
};

export default Home;
