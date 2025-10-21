import FeedCard from "@/components/Posts/PostCard";
import InfoUserCard from "@/components/Home/InfoUserCard";
import RightSide from "@/components/Home/RightSide";
import { Button } from "@/components/ui/button";
import { useScrollRef } from "@/contexts/ScrollContext";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CreatePost from "@/components/Posts/CreatePost";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PostList from "@/components/Posts/PostList";

const Home = () => {
    const scrollRef = useScrollRef();
    const [open, setOpen] = useState(false);

    return (
        <section className={`fixed inset-0 bg-background transition-all duration-300 pt-20`}>
            <div className="grid grid-cols-12 gap-2 h-full">
                {/* Info User and button add post - Fixed Left */}
                <div className="hidden lg:block lg:col-span-3 h-[90vh] bg-muted mx-2 px-6 py-10 rounded-xl shadow-md overflow-y-auto">
                    <div className="sticky top-0">
                        <div className="flex flex-col gap-5">
                            <InfoUserCard />
                            <Dialog
                                open={open}
                                onOpenChange={(isOpen) => {
                                    setOpen(isOpen);
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        onClick={() => setOpen(true)}
                                        className={cn(
                                            "w-full py-5 cursor-pointer rounded-2xl font-semibold text-md flex items-center justify-center gap-2",
                                            "bg-gradient-primary text-white",
                                            "hover:scale-[1.03] hover:brightness-110 active:scale-[0.98]",
                                            "transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
                                        )}
                                    >
                                        <Plus className="size-5 font-bold drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                                        <span>Tạo bài viết</span>
                                    </Button>
                                </DialogTrigger>
                                <CreatePost onClose={() => setOpen(false)} />
                            </Dialog>
                        </div>
                    </div>
                </div>

                {/* Feeds - Scrollable Center */}
                <div ref={scrollRef}
                    className="col-span-12 md:col-span-8 lg:col-span-6 h-full overflow-y-auto scrollbar-hide">
                    <div className="space-y-6 pb-6">
                        <PostList />
                    </div>
                </div>

                {/* ListFriend and message - Fixed Right */}
                <div className="hidden md:flex md:col-span-4 h-[90vh] lg:col-span-3 bg-muted mx-2 px-6 py-10 rounded-xl shadow-md overflow-y-auto">
                    <div className="sticky top-0">
                        <RightSide />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
