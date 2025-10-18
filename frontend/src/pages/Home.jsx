import { Button } from '@/components/ui/button';
import React from 'react';

const Home = () => {
    return (
        <section className='h-[200vh] pt-20'>
            <div className="fixed inset-0 z-0">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px]" />

                {/* Blurred gradient lights */}
                <div className="absolute top-10 left-10 size-96 bg-emerald-500 opacity-20 blur-[100px] animate-pulse" style={{ animationDelay: "0s" }} />
                <div className="absolute top-20 right-20 size-96 bg-red-500 opacity-20 blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute bottom-10 right-10 size-96 bg-cyan-500 opacity-20 blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>
            <div className='flex justify-center items-center flex-col'>
                Home
            </div>
        </section>
    );
};

export default Home;
