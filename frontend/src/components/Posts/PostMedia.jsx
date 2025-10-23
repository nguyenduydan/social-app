
const PostMedia = ({ media }) => {
    if (!media?.length) return null;

    const handleMediaClick = (e) => {
        // Ngăn không cho click vào video control lan lên cha
        e.stopPropagation();
    };

    if (media.length === 1) {
        const m = media[0];
        return (
            <div className="mt-3 w-full flex justify-center overflow-hidden bg-muted max-h-[600px]">
                {m.type === "video" ? (
                    <video
                        src={m.url}
                        controls
                        crossOrigin="anonymous"
                        className="w-full h-auto max-h-[600px] object-contain"
                        onClick={handleMediaClick}
                        onTouchStart={handleMediaClick}
                    />
                ) : (
                    <img
                        src={m.url}
                        alt="media-single"
                        crossOrigin="anonymous"
                        className="w-full h-auto max-h-[600px] object-contain"
                    // cho phép click mở detail
                    />
                )}
            </div>
        );
    }

    // Nếu nhiều hơn 1 ảnh -> gallery 2 cột
    return (
        <div
            className="
        grid gap-1 mt-3 overflow-hidden
        grid-cols-2
        max-h-[600px]
      "
        >
            {media.slice(0, 4).map((m, idx) => (
                <div
                    key={idx}
                    className="relative overflow-hidden bg-muted flex items-center justify-center"
                >
                    {m.type === "video" ? (
                        <video
                            src={m.url}
                            controls
                            crossOrigin="anonymous"
                            className="w-full h-auto max-h-[400px] object-contain"
                            onClick={handleMediaClick}
                            onTouchStart={handleMediaClick}
                        />
                    ) : (
                        <img
                            src={m.url}
                            alt={`media-${idx}`}
                            crossOrigin="anonymous"
                            className="w-full h-auto max-h-[300px] object-cover object-center"
                        />
                    )}

                    {idx === 3 && media.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold">
                            +{media.length - 4}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};


export default PostMedia;
