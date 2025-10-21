import React from 'react';
import "./loader.css";

function cuberLoader() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-muted'>
            <div className="spinner z-50">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default cuberLoader;
