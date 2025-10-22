import { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

const ScrollContext = createContext(null);

export const ScrollProvider = ({ children }) => {
    const scrollRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [location.pathname]);

    return (
        <ScrollContext.Provider value={scrollRef}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScrollRef = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScrollRef must be used within ScrollProvider');
    }
    return context;
};
