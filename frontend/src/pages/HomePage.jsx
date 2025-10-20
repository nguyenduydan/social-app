import FeedCard from "@/components/Feed/FeedCard";
import InfoUserCard from "@/components/Home/InfoUserCard";
import RightSide from "@/components/Home/RightSide";
import { Button } from "@/components/ui/button";
import { useScrollRef } from "@/contexts/ScrollContext";
import { Plus } from "lucide-react";

const Home = () => {
    const scrollRef = useScrollRef();

    return (
        <section className={`fixed inset-0 bg-background transition-all duration-300 pt-20`}>
            <div className="grid grid-cols-12 gap-2 h-full">
                {/* Info User and button add post - Fixed Left */}
                <div className="hidden lg:block lg:col-span-3 h-[90vh] bg-muted mx-2 px-6 py-10 rounded-xl shadow-md overflow-y-auto">
                    <div className="sticky top-0">
                        <div className="flex flex-col gap-5">
                            <InfoUserCard />
                            <Button className="w-full text-secondary font-bold py-5 text-md bg-gradient-primary hover:brightness-130 transition-all">
                                <Plus className="font-bold size-5" />
                                Tạo bài viết
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Feeds - Scrollable Center */}
                <div ref={scrollRef}
                    className="col-span-12 md:col-span-8 lg:col-span-6 h-full overflow-y-auto scrollbar-hide">
                    <div className="space-y-6 pb-6">
                        <FeedCard />
                        <FeedCard />
                        <FeedCard />
                        <FeedCard />
                        <FeedCard />
                        <FeedCard />
                        <FeedCard />
                        <FeedCard />
                        <FeedCard />
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
