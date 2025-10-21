import { EllipsisVertical, Heart, MessageCircle, Share, Share2, Trash, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { getTimeAgo } from "@/lib/calculatorTime";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { usePostStore } from "@/store/usePostStore";
import { useAuthStore } from "@/store/useAuthStore";

const FeedCard = ({ post }) => {
    const { user } = useAuthStore();
    const { deletePost } = usePostStore();

    const handleDeletePost = () => {
        deletePost(post._id);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Card className="px-8 py-10 bg-card gap-2 shadow-md border-0 rounded-2xl">
                {/* Header */}
                <CardHeader className="pb-0 px-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Avatar className="size-12">
                                <AvatarImage src={post.author?.avatar} alt={post.author?.displayName} crossOrigin="anonymous" />
                                <AvatarFallback className="bg-accent"><User /></AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                                <p className="font-bold text-sm sm:text-base">{post.author?.displayName || "Người dùng"}</p>
                                <p className="text-xs text-gray-500"> {getTimeAgo(post.createdAt)}</p>
                            </div>
                        </div>
                        {user._id === post.author._id && (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="cursor-pointer" asChild>
                                    <EllipsisVertical className="text-gray-500 cursor-pointer hover:text-black dark:hover:text-white transition" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="translate-x-[-20px]">
                                    <DropdownMenuItem onClick={handleDeletePost} className="hover:focus:bg-red-500">
                                        <Trash />Xóa
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </CardHeader>

                {/* Description */}
                <CardDescription className="px-3 pb-3 text-sm sm:text-base">
                    {post.content}
                </CardDescription>

                {/* Image */}
                <CardContent className="p-0">
                    <div className="w-full overflow-hidden rounded-2xl">
                        {post.media && post.media.length > 0 && (
                            <div
                                className={`grid gap-2 mt-3 rounded-lg overflow-hidden ${post.media.length === 1
                                    ? "grid-cols-1"
                                    : post.media.length === 2
                                        ? "grid-cols-2"
                                        : post.media.length === 3
                                            ? "grid-cols-2 grid-rows-2"
                                            : "grid-cols-2"
                                    }`}
                            >
                                {post.media.slice(0, 4).map((m, idx) => (
                                    <div
                                        key={idx}
                                        className={`relative overflow-hidden ${post.media.length === 3 && idx === 0 ? "row-span-2" : ""
                                            } ${m.type === "video"
                                                ? "bg-black/10 rounded-lg"
                                                : "bg-gray-100 rounded-lg"
                                            }`}
                                    >
                                        {m.type === "video" ? (
                                            <video
                                                src={m.url}
                                                controls
                                                crossOrigin="anonymous"
                                                className="w-full max-h-[500px]"
                                            />
                                        ) : (
                                            <img
                                                src={m.url}
                                                alt={`media-${idx}`}
                                                crossOrigin="anonymous"
                                                className="w-full h-full object-cover"
                                            />
                                        )}

                                        {/* Nếu có nhiều hơn 4 ảnh → hiển thị overlay “+N” */}
                                        {idx === 3 && post.media.length > 4 && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-semibold">
                                                +{post.media.length - 4}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
                {/* Footer (Actions) */}
                <CardFooter className="flex justify-between items-center px-5 pt-3">
                    <Button variant="ghost" className="flex items-center space-x-2 text-gray-400 hover:text-red-600 transition">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm font-medium">Like</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center space-x-2 text-gray-400 hover:text-blue-600 transition">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Comment</span>
                    </Button>
                    <Button variant="ghost" className="flex items-center space-x-2 text-gray-400 hover:text-green-600 transition">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default FeedCard;
