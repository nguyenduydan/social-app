import { useEffect, useRef } from "react";

const PostMedia = ({ media, onOpenDetail }) => {
    if (!media?.length) return null;

    const stopPropagation = (e) => e.stopPropagation();

    // Hàm dừng tất cả video trong DOM (chỉ trong component này)
    const pauseAllVideos = () => {
        const videos = document.querySelectorAll("video");
        videos.forEach((v) => v.pause());
    };

    const VideoPlayer = ({ src }) => {
        const videoRef = useRef(null);

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
                { threshold: 0.5 }
            );

            observer.observe(video);
            return () => observer.disconnect();
        }, []);

        return (
            <div className="relative w-full">
                <video
                    ref={videoRef}
                    src={src}
                    controls
                    playsInline
                    muted
                    crossOrigin="anonymous"
                    className="w-full h-auto max-h-[600px] object-contain"
                    onClick={stopPropagation}
                />

                {/* overlay bấm mở chi tiết, chừa chỗ cho controls */}
                <div
                    className="absolute inset-x-0 top-0 bottom-[50px] cursor-pointer"
                    onClick={(e) => {
                        if (e.target.tagName.toLowerCase() === "video") return;
                        e.stopPropagation();
                        pauseAllVideos(); // ⏸ dừng video trước khi mở chi tiết
                        onOpenDetail?.();
                    }}
                />
            </div>
        );
    };

    // ---- single media ----
    if (media.length === 1) {
        const m = media[0];
        return (
            <div className="mt-3 w-full flex justify-center overflow-hidden bg-muted max-h-[600px] relative">
                {m.type === "video" ? (
                    <VideoPlayer src={m.url} />
                ) : (
                    <img
                        src={m.url}
                        alt="media-single"
                        crossOrigin="anonymous"
                        className="w-full h-auto max-h-[600px] object-contain cursor-pointer"
                        onClick={() => {
                            pauseAllVideos();
                            onOpenDetail?.();
                        }}
                    />
                )}
            </div>
        );
    }

    // ---- multiple media ----
    return (
        <div className="grid gap-1 mt-3 overflow-hidden grid-cols-2 max-h-[600px]">
            {media.slice(0, 4).map((m, idx) => (
                <div
                    key={idx}
                    className="relative overflow-hidden bg-muted flex items-center justify-center"
                >
                    {m.type === "video" ? (
                        <VideoPlayer src={m.url} />
                    ) : (
                        <img
                            src={m.url}
                            alt={`media-${idx}`}
                            crossOrigin="anonymous"
                            className="w-full h-auto max-h-[300px] object-cover object-center cursor-pointer"
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
};

export default PostMedia;
