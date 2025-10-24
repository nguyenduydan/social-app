import React, { useEffect } from "react";

export default function TextLoader() {
    useEffect(() => {
        const cleanup = () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };

        const handleVisibilityChange = () => {
            const elements = document.querySelectorAll(".animated-text, .filled-text");
            if (!elements.length) return;

            elements.forEach(element => {
                if (document.hidden) {
                    element.classList.remove("animate");
                } else {
                    element.classList.add("animate");
                }
            });
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return cleanup;
    }, []);

    return (
        <div className="flex items-center justify-center p-6">
            <svg
                viewBox="0 0 920 220"
                className="w-full max-w-4xl"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden
            >
                <defs>
                    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--muted-foreground))" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" />
                    </linearGradient>

                    <linearGradient id="shineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="white" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="transparent" />
                        <animateTransform
                            attributeName="gradientTransform"
                            type="translate"
                            values="-1;1"
                            dur="3s"
                            repeatCount="indefinite"
                        />
                    </linearGradient>

                    <filter id="textShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow
                            dx="0"
                            dy="10"
                            stdDeviation="18"
                            floodColor="hsl(var(--primary-glow))"
                            floodOpacity="0.35"
                        />
                    </filter>
                </defs>

                {/* Fill text */}
                <text
                    className="filled-text animate"
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight="800"
                    fontSize="200"
                    fill="url(#textGradient)"
                    filter="url(#textShadow)"
                >
                    DIFA
                </text>

                {/* Stroke text */}
                <text
                    className="animated-text animate"
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight="800"
                    fontSize="200"
                    fill="none"
                    stroke="url(#textGradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    DIFA
                </text>

                {/* Shine overlay */}
                <text
                    className="shine-text"
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight="800"
                    fontSize="200"
                    fill="url(#shineGradient)"
                    opacity="0.5"
                >
                    DIFA
                </text>

                <style>{`
                    .animated-text {
                        stroke-dasharray: 1400;
                        stroke-dashoffset: 1400;
                    }

                    .animated-text.animate {
                        animation: drawStroke 4s ease-out infinite;
                    }

                    .filled-text {
                        opacity: 0;
                    }

                    .filled-text.animate {
                        animation: fillText 4s ease-out infinite;
                    }

                    @keyframes drawStroke {
                        0% {
                            stroke-dashoffset: 1400;
                            opacity: 0.2;
                        }
                        45% {
                            stroke-dashoffset: 0;
                            opacity: 1;
                        }
                        75%, 100% {
                            stroke-dashoffset: 0;
                            opacity: 0;
                        }
                    }

                    @keyframes fillText {
                        0%, 45% {
                            opacity: 0;
                        }
                        75% {
                            opacity: 1;
                        }
                        100% {
                            opacity: 0;
                        }
                    }
                `}</style>
            </svg>
        </div>
    );
}
