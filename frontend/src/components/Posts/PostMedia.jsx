import { memo, useMemo } from "react";
import { VideoPlayer } from "./VideoPlayer";

const PostMedia = memo(({ media, onOpenDetail }) => {
    const pauseAllVideos = () => {
        document.querySelectorAll("video").forEach((v) => v.pause());
    };

    const renderedMedia = useMemo(() => {
        if (!media?.length) return null;
        if (media.length === 1) {
            const m = media[0];
            return (
                <div className="mt-3 w-full flex justify-center overflow-hidden bg-muted max-h-[600px] relative">
                    {m.type === "video" ? (
                        <VideoPlayer src={m.url} onOpenDetail={onOpenDetail} />
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

        // multiple media
        return (
            <div className="grid gap-1 mt-3 overflow-hidden grid-cols-2 max-h-[600px]">
                {media.slice(0, 4).map((m, idx) => (
                    <div
                        key={m.url || idx}
                        className="relative overflow-hidden bg-muted flex items-center justify-center"
                    >
                        {m.type === "video" ? (
                            <VideoPlayer src={m.url} onOpenDetail={onOpenDetail} />
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
