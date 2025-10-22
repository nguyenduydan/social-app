import { EllipsisVertical, Heart, MessageCircle, Share, Share2, Trash, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { getTimeAgo } from "@/lib/calculatorTime";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { usePostStore } from "@/store/usePostStore";
import { useAuthStore } from "@/store/useAuthStore";
import PostMedia from "./PostMedia";

const FeedCard = ({ post }) => {
    const { user } = useAuthStore();
    const { deletePost } = usePostStore();

    const handleDeletePost = () => {
        deletePost(post._id);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Card className=" py-10 bg-card gap-2 shadow-md border-0 rounded-2xl transition-all duration-300">
                {/* Header */}
                <CardHeader className="pb-0 px-5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Avatar className="size-12">
                                <AvatarImage src={post.author?.avatar?.url} alt={post.author?.displayName} className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
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

                {/* Image */}
                <CardContent className="p-0">
                    <div className="px-8 pb-3 text-sm sm:text-base">
                        {post.content}
                    </div>
                    <div className="w-full overflow-hidden">
                        {post.media?.length > 0 && <PostMedia media={post.media} />}
                    </div>
                </CardContent>

                {/* Footer (Actions) */}
                <CardFooter className="flex justify-between items-center px-8 pt-3">
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
