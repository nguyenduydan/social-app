import React from 'react';
import "./loader.css";

const CuberLoader = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="spinner w-24 h-24 relative z-10">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default CuberLoader;
