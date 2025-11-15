// Easing functions giống Telegram
const TELEGRAM_EASE = [0.42, 0, 0.58, 1]; // cubic-bezier cho transition mượt
const TELEGRAM_EASE_OUT = [0.25, 0.46, 0.45, 0.94]; // ease-out mượt hơn
const TELEGRAM_EASE_IN_OUT = [0.65, 0, 0.35, 1]; // ease-in-out như Telegram

export const slideVariants = {
    initial: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 0.95,
    }),
    animate: {
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.35,
            ease: TELEGRAM_EASE_IN_OUT,
            opacity: {
                duration: 0.25,
                ease: "easeOut"
            }
        },
    },
    exit: (direction) => ({
        x: direction > 0 ? '-30%' : '30%',
        opacity: 0,
        scale: 0.97,
        transition: {
            duration: 0.25,
            ease: TELEGRAM_EASE_OUT,
        },
    }),
};

export const headerVariants = {
    initial: {
        y: -20,
        opacity: 0,
        scale: 0.95
    },
    animate: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: TELEGRAM_EASE_IN_OUT,
            opacity: {
                duration: 0.2,
            }
        }
    },
    exit: {
        y: 20,
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2,
            ease: TELEGRAM_EASE_OUT,
        }
    },
};

// Animation cho message bubbles (fade in từ dưới lên)
export const messageBubbleVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.95,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: TELEGRAM_EASE_OUT,
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: {
            duration: 0.15,
            ease: "easeIn",
        }
    }
};

// Animation cho list items (stagger effect)
export const listItemVariants = {
    initial: {
        opacity: 0,
        x: -20,
        scale: 0.95,
    },
    animate: (index) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.25,
            ease: TELEGRAM_EASE_OUT,
            delay: index * 0.03, // Stagger delay như Telegram
        }
    }),
    exit: {
        opacity: 0,
        x: -10,
        transition: {
            duration: 0.15,
            ease: "easeIn",
        }
    }
};

// Animation cho modal/dialog (scale + fade)
export const modalVariants = {
    initial: {
        opacity: 0,
        scale: 0.9,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.25,
            ease: TELEGRAM_EASE_OUT,
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        }
    }
};

// Animation cho overlay/backdrop
export const overlayVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut",
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.15,
            ease: "easeIn",
        }
    }
};

// Animation cho typing indicator
export const typingDotVariants = {
    initial: {
        y: 0,
    },
    animate: {
        y: [0, -8, 0],
        transition: {
            duration: 0.6,
            ease: "easeInOut",
            repeat: Infinity,
        }
    }
};

// Animation cho swipe actions (như swipe to reply)
export const swipeVariants = {
    initial: {
        x: 0,
    },
    swipeLeft: {
        x: -60,
        transition: {
            duration: 0.2,
            ease: TELEGRAM_EASE_OUT,
        }
    },
    swipeRight: {
        x: 60,
        transition: {
            duration: 0.2,
            ease: TELEGRAM_EASE_OUT,
        }
    },
    reset: {
        x: 0,
        transition: {
            duration: 0.3,
            ease: TELEGRAM_EASE_IN_OUT,
        }
    }
};

// Spring animation cho interactive elements
export const springVariants = {
    tap: {
        scale: 0.95,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17,
        }
    },
    hover: {
        scale: 1.02,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        }
    }
};

// Smooth page transition
export const pageVariants = {
    initial: {
        opacity: 0,
        scale: 0.98,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: TELEGRAM_EASE_OUT,
        }
    },
    exit: {
        opacity: 0,
        scale: 1.02,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        }
    }
};

// Slide up animation (bottom sheet style)
export const slideUpVariants = {
    initial: {
        y: "100%",
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.35,
            ease: TELEGRAM_EASE_OUT,
        }
    },
    exit: {
        y: "100%",
        opacity: 0,
        transition: {
            duration: 0.25,
            ease: TELEGRAM_EASE_IN_OUT,
        }
    }
};
