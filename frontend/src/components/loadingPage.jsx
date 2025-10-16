import React from 'react';
import { Spinner } from './ui/spinner';

const LoadingPage = () => {
    return (
        <div className='min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden'>
            <Spinner className="size-10" />
            <p className='text-3xl text-shadow-green-500 text-shadow-lg font-extrabold uppercase text-white'>Social - DIFA</p>
        </div>
    );
};

export default LoadingPage;
