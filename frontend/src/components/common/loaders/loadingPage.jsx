import React, { useEffect } from "react";

export default function LoadingPage() {
    useEffect(() => {
        const svgText = document.querySelector('.svg-draw');
        if (!svgText) return;

        function playOnce() {
            svgText.style.animation = 'none';
            void svgText.getBoundingClientRect();
            svgText.style.animation = '';
        }

        playOnce();
        let loop = setInterval(playOnce, 5000);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) clearInterval(loop);
            else loop = setInterval(playOnce, 5000);
        });

        return () => clearInterval(loop);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-500/30 to-violet-500/20 blur-3xl opacity-80 animate-blob" />
            <div className="absolute -bottom-36 -right-44 w-80 h-80 rounded-full bg-gradient-to-bl from-pink-400/20 to-amber-400/10 blur-2xl opacity-60 animate-blob animation-delay-2000" />

            <div className="relative z-10 flex items-center justify-center">
                <svg viewBox="0 0 920 220" className="w-full max-w-4xl" preserveAspectRatio="xMidYMid meet" aria-hidden>
                    <defs>
                        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="#000" floodOpacity="0.45" />
                        </filter>
                    </defs>

                    <g transform="translate(0,8)">
                        <text
                            className="svg-draw"
                            x="50%"
                            y="60%"
                            textAnchor="middle"
                            fontWeight="800"
                            fontSize="200"
                            fill="none"
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#softShadow)"
                            style={{ paintOrder: 'stroke' }}
                        >
                            DIFA
                        </text>
                    </g>

                    <style>{`
            .svg-draw {
              stroke-dasharray: 1400;
              stroke-dashoffset: 1400;
              animation: draw-stroke 4s ease-in-out infinite alternate;
            }

            @keyframes draw-stroke {
              0% { stroke-dashoffset: 1400; }
              50% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: 1400; }
            }

            @keyframes blob {
              0% { transform: translate(0,0) scale(1); }
              33% { transform: translate(12px,-8px) scale(1.06); }
              66% { transform: translate(-10px,6px) scale(0.98); }
              100% { transform: translate(0,0) scale(1); }
            }
            .animate-blob { animation: blob 6s infinite ease-in-out; }
            .animation-delay-2000 { animation-delay: 2s; }
          `}</style>
                </svg>
            </div>
        </div>
    );
}
