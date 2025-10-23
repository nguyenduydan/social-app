import {
    Edit,
    EllipsisVertical,
    Heart,
    MessageCircle,
    Share2,
    Trash,
    User,
} from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../ui/avatar";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
    CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { getTimeAgo } from "@/lib/calculatorTime";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { usePostStore } from "@/store/usePostStore";
import { useAuthStore } from "@/store/useAuthStore";
import PostMedia from "./PostMedia";
import { useState } from "react";
import PostDetail from "./PostDetail";
import UpdatePost from "./UpdatePost";

const FeedCard = ({ post }) => {
    const { user } = useAuthStore();
    const { deletePost } = usePostStore();
    const [isPostDetail, setIsPostDetail] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);

    const handleDeletePost = () => {
        deletePost(post._id);
    };

    const handleOpenDetail = () => {
        setIsPostDetail(true);
    };

    return (
        <div className="max-w-3xl mx-auto">
            {/* Dialog hiển thị chi tiết bài viết */}
            <Dialog open={isPostDetail} onOpenChange={setIsPostDetail}>
                <DialogContent
                    className="min-w-sm md:min-w-2xl lg:min-w-7xl h-[900px] md:mx-0 p-0 overflow-hidden border-none rounded-2xl"
                >
                    <PostDetail post={post} onClose={() => setIsPostDetail(false)} />
                </DialogContent>
            </Dialog>

            <Card className="py-0 bg-card gap-2 shadow-md border-0 rounded-2xl transition-all duration-300">
                {/* Header */}
                <CardHeader className="py-5 px-5 rounded-t-2xl hover:bg-muted">
                    <div className="flex justify-between items-center">
                        {/* Left: Avatar + Info (click mở detail) */}
                        <div
                            className="flex flex-10 items-center space-x-3 cursor-pointer"
                            onClick={handleOpenDetail}
                        >
                            <Avatar className="size-12">
                                <AvatarImage
                                    src={post.author?.avatar?.url}
                                    alt={post.author?.displayName}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                />
                                <AvatarFallback className="bg-accent">
                                    <User />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                                <p className="font-bold text-sm sm:text-base hover:underline">
                                    {post.author?.displayName || "Người dùng"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {getTimeAgo(post.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Right: Menu */}
                        {user._id === post.author._id && (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-1"
                                        >
                                            <EllipsisVertical className="text-gray-500 cursor-pointer size-7 hover:text-black dark:hover:text-white transition" />
                                        </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        onClick={(e) => e.stopPropagation()}
                                        className="translate-x-[-20px]"
                                    >
                                        <DropdownMenuItem
                                            onClick={() => setUpdateOpen(true)}
                                            className="flex items-center text-sm"
                                        >
                                            <Edit className="mr-2 h-4 w-4 text-accent" />
                                            Sửa
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={handleDeletePost}
                                            className="text-destructive flex items-center text-sm"
                                        >
                                            <Trash className="mr-2 h-4 w-4" />
                                            Xóa
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
                                    <DialogContent className="max-w-2xl">
                                        <UpdatePost
                                            post={post}
                                            onOpen={updateOpen}
                                            onClose={() => setUpdateOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </>
                        )}
                    </div>
                </CardHeader>
                {/* Nội dung + Ảnh */}
                <CardContent
                    className="p-0 cursor-pointer select-none"
                    onClick={handleOpenDetail}
                >
                    <div className="px-8 pb-3 text-sm sm:text-base">{post.content}</div>
                    {post.media?.length > 0 && (
                        <div className="w-full overflow-hidden">
                            <PostMedia media={post.media} />
                        </div>
                    )}
                </CardContent>
                {/* Footer */}
                <CardFooter className="flex justify-between items-center px-8 pt-3 pb-5">
                    <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-400 hover:text-red-600 transition"
                    >
                        <Heart className="w-5 h-5" />
                        <span className="text-sm font-medium">Like</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-400 hover:text-blue-600 transition"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Comment</span>
                    </Button>
                    <Button
                        variant="ghost"
                        className="flex items-center space-x-2 text-gray-400 hover:text-green-600 transition"
                    >
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Share</span>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default FeedCard;
