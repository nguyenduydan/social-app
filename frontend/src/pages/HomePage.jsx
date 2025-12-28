import LeftSide from "@/components/Home/LeftSide";
import MainSide from "@/components/Home/MainSide";
import RightSide from "@/components/Home/RightSide";
import PageHeader from "@/components/common/navigation/PageHeader";

const HomePage = () => {
    return (
        <div className="w-full h-full flex flex-col bg-background">
            {/* PAGE TOP BAR - Local to this page */}
            <PageHeader showSearch={true} showActions={true} title="Home" />

            {/* MAIN CONTENT WITH 2 COLUMNS */}
            <div className="flex-1 overflow-hidden flex gap-0">
                {/* PRIMARY COLUMN - Feed */}
                <main className="flex-1 overflow-y-auto scrollbar-hide">
                    <MainSide />
                </main>

                {/* SECONDARY COLUMN - Widgets (Hidden on tablet/mobile) */}
                <aside className="hidden lg:flex lg:w-72 2xl:w-80 xl:w-96 lg:flex-col lg:border-l lg:border-border/30 lg:bg-card/20 lg:overflow-hidden flex-shrink-0">
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        <RightSide />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HomePage;
