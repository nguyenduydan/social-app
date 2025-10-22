import LeftSide from "@/components/Home/LeftSide";
import RightSide from "@/components/Home/RightSide";
import PostList from "@/components/Posts/PostList";

const Home = () => {

    return (
        <section className="bg-background">
            <div className="grid grid-cols-12 gap-2 min-h-screen">
                {/* Info User and button add post - Fixed Left  - desktop*/}
                <div className="hidden lg:block lg:col-span-3 h-screen shadow-md overflow-y-auto sticky top-0">
                    <LeftSide className="flex flex-col gap-5 " />
                </div>

                {/* Feeds - Scrollable Center */}
                <main className="col-span-12 md:col-span-8 lg:col-span-6">
                    <div className="space-y-6 pb-6">
                        <PostList />
                    </div>
                </main>

                {/* ListFriend and message - Fixed Right */}
                <div className="hidden md:flex md:col-span-4 lg:col-span-3 h-screen shadow-md overflow-y-auto sticky top-0">
                    <RightSide />
                </div>
            </div>
        </section>
    );
};

export default Home;
