import { memo, useEffect, useRef, useState } from "react";

export const VideoPlayer = memo(({ src, onOpenDetail }) => {
    const videoRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            },
            { threshold: 0.6 }
        );

        observer.observe(video);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            className="relative w-full bg-muted overflow-hidden"
            style={{ minHeight: "220px" }}
        >
            <video
                ref={videoRef}
                src={src}
                controls
                playsInline
                muted
                preload="metadata"
                crossOrigin="anonymous"
                className={`w-full h-auto max-h-[600px] object-contain transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                onLoadedData={() => setIsLoaded(true)}
                onClick={(e) => e.stopPropagation()}
            />
            {!isLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <div
                className="absolute inset-x-0 top-0 bottom-[50px] cursor-pointer"
                onClick={(e) => {
                    if (e.target.tagName.toLowerCase() === "video") return;
                    document.querySelectorAll("video").forEach((v) => v.pause());
                    onOpenDetail?.();
                }}
            />
        </div>
    );
});
VideoPlayer.displayName = "VideoPlayer";
