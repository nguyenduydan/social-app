import React from 'react';
import CuberLoader from './CuberLoader';
import TextLoader from './TextLoader';

const LoadPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-background w-screen relative overflow-hidden">
            <CuberLoader />
            <div className="mt-8">
                <TextLoader />
            </div>
        </div>
    );
};

export default LoadPage;
