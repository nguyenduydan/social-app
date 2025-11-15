import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/useUIStore';

// HOC để wrap component với animation có thể tắt được
export const WithAnimation = (Component, variants) => {
    return React.forwardRef((props, ref) => {
        const { enableAnimation } = useUIStore();

        if (!enableAnimation) {
            return <Component ref={ref} {...props} />;
        }

        const MotionComponent = motion(Component);
        return (
            <MotionComponent
                ref={ref}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                {...props}
            />
        );
    });
};

// Component wrapper cho AnimatePresence
export const AnimatedPresence = ({ children, ...props }) => {
    const { enableAnimation } = useUIStore();

    if (!enableAnimation) {
        return <>{children}</>;
    }

    return <AnimatePresence {...props}>{children}</AnimatePresence>;
};

// Component cho motion.div thông dụng
export const AnimatedDiv = ({ variants, children, className = '', ...props }) => {
    const { enableAnimation } = useUIStore();

    if (!enableAnimation) {
        return <div className={className} {...props}>{children}</div>;
    }

    return (
        <motion.div
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};
