import { useAuthStore } from '@/store/useAuthStore';
import PostList from '../Posts/PostList';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { User } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Dialog, DialogTrigger } from '../ui/dialog';
import CreatePost from '../Posts/CreatePost';

const MainSide = ({ className }) => {
    const { user } = useAuthStore();
    const [open, setOpen] = useState(false);

    return (
        <div className={`${className}`}>
            <div className="flex flex-col items-center w-full px-2 sm:px-4 md:px-6 space-y-6 pb-6">
                {/* Ô tạo bài viết */}
                <Card className="w-full max-w-xl md:max-w-3xl mt-4 border border-border/60 shadow-sm rounded-2xl">
                    <CardContent className="flex items-center gap-3 p-4 w-full">
                        {/* Avatar */}
                        <Avatar className="size-10 sm:size-12 shrink-0 ring-2 ring-primary/10 transition-all duration-300 hover:scale-105">
                            <AvatarImage src={user.avatar?.url || ""} alt={user?.displayName || "user"} />
                            <AvatarFallback className="text-lg sm:text-2xl bg-primary/10 text-primary">
                                <User />
                            </AvatarFallback>
                        </Avatar>

                        {/* Button */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="
                                    flex-1 justify-start text-muted-foreground/70 text-left
                                    border border-border bg-muted/50
                                    hover:bg-muted hover:text-foreground
                                    transition-all duration-200
                                    rounded-full px-4 py-3
                                    text-xs sm:text-base
                                    shadow-inner dark:shadow-inner
                                    h-auto
                                ">
                                    {user?.displayName || "user"}, bạn đang làm gì thế?
                                </Button>
                            </DialogTrigger>

                            <CreatePost onOpen={open} onClose={() => setOpen(false)} />
                        </Dialog>
                    </CardContent>
                </Card>

                {/* Danh sách bài viết */}
                <div className="w-full max-w-2xl md:max-w-3xl">
                    <PostList />
                </div>
            </div>
        </div>
    );
};

export default MainSide;
