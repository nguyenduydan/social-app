export const slideVariants = {
    initial: (direction) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
    }),
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.22,
            ease: [0.25, 0.8, 0.5, 1],
        },
    },
    exit: (direction) => ({
        x: direction > 0 ? -100 : 100,
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: [0.25, 0.8, 0.5, 1],
        },
    }),
};

export const headerVariants = {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    transition: { duration: 0.18, ease: "easeOut" },
};
