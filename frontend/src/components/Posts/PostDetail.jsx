import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { getTimeAgo } from "@/lib/calculatorTime";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { DialogDescription, DialogTitle } from "../ui/dialog";

const PostDetail = ({ post }) => {
    const [liked, setLiked] = useState(false);
    const hasMedia = post.media && post.media.length > 0;

    const toggleLike = () => setLiked(!liked);

    return (
        <div
            className={cn(
                "grid gap-0 h-full w-full overflow-hidden rounded-2xl",
                hasMedia ? "grid-cols-1 lg:grid-cols-[2fr_1fr]" : "grid-cols-1"
            )}
        >
            {/* LEFT: Media (Image / Video / Carousel) - Only show if media exists */}
            {hasMedia && (
                <div className="relative bg-black flex justify-center items-center">
                    {post.media.length > 1 ? (
                        <Carousel className="h-full flex justify-center items-center bg-card-foreground dark:bg-card">
                            <CarouselContent>
                                {post.media.map((m, i) => (
                                    <CarouselItem key={i} className="flex justify-center items-center">
                                        {m.type?.startsWith("video") ? (
                                            <video
                                                src={m.url}
                                                className="w-auto max-h-[300px] lg:max-h-[900px] object-contain"
                                                controls
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <img
                                                src={m.url}
                                                alt=""
                                                className="w-full lg:h-full max-h-[500px] object-contain"
                                            />
                                        )}
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm" />
                            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm" />
                        </Carousel>
                    ) : (
                        post.media[0].type?.startsWith("video") ? (
                            <video
                                controls
                                src={post.media[0].url}
                                autoPlay
                                className="max-h-[500px] lg:max-h-[900px] w-auto object-contain"
                            />
                        ) : (
                            <img
                                src={post.media[0].url}
                                alt=""
                                className="w-full max-h-[500px] lg:h-full object-contain"
                            />
                        )
                    )}
                </div>
            )}

            {/* RIGHT: Info + Comments */}
            <div className="flex flex-col justify-between gap-0 space-y-0 bg-background overflow-hidden">
                <div className="flex justify-between items-center px-5 py-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                        <Avatar className="size-10">
                            <AvatarImage
                                src={post.author?.avatar?.url}
                                alt={post.author?.displayName}
                                className="object-cover"
                            />
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col leading-tight">
                            <DialogTitle className="font-semibold text-sm sm:text-base">
                                {post.author?.displayName || "Người dùng"}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-gray-500">
                                {getTimeAgo(post.createdAt)}
                            </DialogDescription>
                        </div>
                    </div>
                </div>
                {/* Content */}
                <div className="px-5 text-sm sm:text-base text-foreground/90">
                    {post.content || "Không có nội dung"}
                </div>

                {/* Like + Share */}
                <div className="flex items-center justify-around border-b border-muted py-3">
                    <Button
                        variant="ghost"
                        className={cn(
                            "flex items-center gap-2 transition",
                            liked ? "text-destructive hover:text-destructive" : "text-muted-foreground hover:text-destructive"
                        )}
                        onClick={toggleLike}
                    >
                        <Heart
                            className={cn("w-5 h-5 transition-transform", liked && "fill-destructive")}
                        />
                        <span>Thích</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-muted-foreground hover:text-blue-600 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>Bình luận</span>
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-muted-foreground hover:text-green-600 transition"
                    >
                        <Share2 className="w-5 h-5" />
                        <span>Chia sẻ</span>
                    </Button>
                </div>
                <ScrollArea className="flex-1">
                    {/* Comments Section */}
                    <div className="p-5 space-y-4">
                        {post.comments?.length > 0 ? (
                            post.comments.map((c, i) => (
                                <Card key={i} className="bg-secondary/20 border-none shadow-none">
                                    <CardContent className="flex gap-3 p-3">
                                        <Avatar className="size-8">
                                            <AvatarImage src={c.user?.avatar?.url} />
                                            <AvatarFallback>
                                                <User />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-semibold">{c.user?.displayName}</p>
                                            <p className="text-sm text-foreground/80">{c.text}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground text-sm">
                                Chưa có bình luận nào
                            </p>
                        )}
                    </div>
                </ScrollArea>

                {/* Comment Input */}
                <div className="hidden md:flex border-t border-muted px-5 py-3 items-center gap-3">
                    <Avatar className="size-8">
                        <AvatarImage src={post.author?.avatar?.url} />
                        <AvatarFallback>
                            <User />
                        </AvatarFallback>
                    </Avatar>
                    <input
                        type="text"
                        placeholder="Viết bình luận..."
                        className="flex-1 rounded-full px-4 py-2 bg-muted/50 focus:outline-none text-sm"
                    />
                    <Button variant="ghost" size="sm">
                        Gửi
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
