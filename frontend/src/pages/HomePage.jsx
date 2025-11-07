import LeftSide from "@/components/Home/LeftSide";
import MainSide from "@/components/Home/MainSide";
import RightSide from "@/components/Home/RightSide";

const Home = () => {

    return (
        <section className="bg-background">
            <div className="grid grid-cols-12 gap-2 min-h-screen">
                {/* Info User and button add post - Fixed Left  - desktop*/}
                <aside className="hidden lg:block lg:col-span-3 sticky top-0 self-start">
                    <LeftSide className="flex flex-col gap-5" />
                </aside>

                {/* Feeds - Scrollable Center */}
                <main className="col-span-12 md:col-span-7 lg:col-span-6">
                    <MainSide />
                </main>

                {/* ListFriend and message - Fixed Right */}
                <aside className="hidden md:block md:col-span-5 lg:col-span-3 sticky top-0 self-start">
                    <RightSide />
                </aside>
            </div>
        </section>
    );
};

export default Home;
