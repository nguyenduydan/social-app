import { memo, useEffect, useRef, useState, useMemo } from "react";

const PostMedia = memo(({ media, onOpenDetail }) => {
    if (!media?.length) return null;

    const stopPropagation = (e) => e.stopPropagation();

    // Dừng tất cả video trong trang
    const pauseAllVideos = () => {
        document.querySelectorAll("video").forEach((v) => v.pause());
    };

    const VideoPlayer = memo(({ src }) => {
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
                style={{ minHeight: "220px" }} // giữ khung ổn định
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
                    onClick={stopPropagation}
                />

                {/* Placeholder khi chưa load xong */}
                {!isLoaded && (
                    <div className="absolute inset-0 bg-muted animate-pulse" />
                )}

                {/* Overlay mở chi tiết */}
                <div
                    className="absolute inset-x-0 top-0 bottom-[50px] cursor-pointer"
                    onClick={(e) => {
                        if (e.target.tagName.toLowerCase() === "video") return;
                        e.stopPropagation();
                        pauseAllVideos();
                        onOpenDetail?.();
                    }}
                />
            </div>
        );
    });
    VideoPlayer.displayName = "VideoPlayer";

    //Dùng useMemo để "memo hóa" render output
    const renderedMedia = useMemo(() => {
        // ---- Single media ----
        if (media.length === 1) {
            const m = media[0];
            return (
                <div className="mt-3 w-full flex justify-center overflow-hidden bg-muted max-h-[600px] relative ">
                    {m.type === "video" ? (
                        <VideoPlayer src={m.url} />
                    ) : (
                        <img
                            src={m.url}
                            alt="media-single"
                            crossOrigin="anonymous"
                            loading="lazy"
                            className="w-full h-auto max-h-[600px] object-contain cursor-pointer transition-transform hover:scale-[1.01]"
                            onClick={() => {
                                pauseAllVideos();
                                onOpenDetail?.();
                            }}
                        />
                    )}
                </div>
            );
        }

        // ---- Multiple media ----
        return (
            <div className="grid gap-1 mt-3 overflow-hidden grid-cols-2 max-h-[600px]">
                {media.slice(0, 4).map((m, idx) => (
                    <div
                        key={m.url || idx}
                        className="relative overflow-hidden bg-muted flex items-center justify-center "
                    >
                        {m.type === "video" ? (
                            <VideoPlayer src={m.url} />
                        ) : (
                            <img
                                src={m.url}
                                alt={`media-${idx}`}
                                crossOrigin="anonymous"
                                loading="lazy"
                                className="w-full h-auto max-h-[300px] object-cover object-center cursor-pointer transition-transform hover:scale-[1.02]"
                                onClick={() => {
                                    pauseAllVideos();
                                    onOpenDetail?.();
                                }}
                            />
                        )}

                        {idx === 3 && media.length > 4 && (
                            <div
                                className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold cursor-pointer"
                                onClick={() => {
                                    pauseAllVideos();
                                    onOpenDetail?.();
                                }}
                            >
                                +{media.length - 4}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }, [media, onOpenDetail]);

    return renderedMedia;
});

PostMedia.displayName = "PostMedia";
export default PostMedia;
