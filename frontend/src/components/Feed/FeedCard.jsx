import { EllipsisVertical, Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardFooter } from "../ui/card";
import avatarNotFound from "@/assets/avatarNotFound.png";
import { Button } from "../ui/button";

const FeedCard = () => {
    return (
        <div className="max-w-3xl mx-auto">
            <Card className="px-8 py-10 bg-card gap-2 shadow-md border-0 rounded-2xl">
                {/* Header */}
                <CardHeader className="pb-0 px-0">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Avatar className="size-12">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback><AvatarImage src={avatarNotFound} /></AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col leading-tight">
                                <p className="font-bold text-sm sm:text-base">Nguyen Thiet Duy Dan</p>
                                <p className="text-xs text-gray-500">a minute ago</p>
                            </div>
                        </div>
                        <EllipsisVertical className="text-gray-500 cursor-pointer hover:text-black dark:hover:text-white transition" />
                    </div>
                </CardHeader>

                {/* Description */}
                <CardDescription className="px-3 pb-3 text-sm sm:text-base">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa facilis aliquam aperiam
                    explicabo minima quas in laborum veniam nam ab fuga exercitationem quibusdam corporis
                    voluptates numquam, consectetur pariatur nisi perferendis.
                </CardDescription>

                {/* Image */}
                <CardContent className="p-0">
                    <div className="w-full overflow-hidden rounded-2xl">
                        <img
                            src="https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg"
                            alt="img"
                            className="w-full h-[400px] object-cover transition-transform duration-300 hover:scale-[1.02]"
                        />
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
