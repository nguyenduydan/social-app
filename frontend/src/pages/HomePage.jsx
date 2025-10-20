import FeedCard from "@/components/Feed/FeedCard";
import LeftSide from "@/components/Home/LeftSide";
import RightSide from "@/components/Home/RightSide";

const Home = () => {
    return (
        <section className="min-h-screen w-full pt-20 px-4 bg-background transition-bg duration-500">
            <div className="grid grid-cols-12 gap-4 h-full">
                {/* Info User */}
                <div className="hidden lg:block lg:col-span-3">
                    <LeftSide />
                </div>

                {/* Feeds*/}
                <div className="h-full col-span-12 md:col-span-8 lg:col-span-6 rounded-2xl space-y-6 overflow-y-hidden">
                    <FeedCard />
                    <FeedCard />
                    <FeedCard />
                </div>

                {/* ListFriend and message */}
                <div className="hidden md:block md:col-span-4 lg:col-span-3">
                    <RightSide />
                </div>
            </div>
        </section>
    );
};

export default Home;
