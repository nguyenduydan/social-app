import React, { useState } from "react";
import Sidebar from "../components/Conversation/Sidebar";
import ChatContainer from "../components/Conversation/ChatContainer";
import useConversationStore from "@/store/useConversationStore";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import PageHeader from "@/components/common/navigation/PageHeader";

const ConversationPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { currentConversation } = useConversationStore();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className="w-full h-full flex flex-col bg-background">
            {/* PAGE TOP BAR - Local to this page */}
            <PageHeader showSearch={false} showActions={true} title="Messages" />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-hidden flex gap-0">
                {/* PRIMARY COLUMN - Chat List (Desktop Only) */}
                <aside className="hidden lg:flex lg:w-72 2xl:w-80 lg:flex-col lg:border-r lg:border-border/30 lg:bg-card/20 lg:overflow-y-auto flex-shrink-0">
                    <Sidebar className="h-full" />
                </aside>

                {/* PRIMARY COLUMN - Chat Container */}
                <main className={`flex-1 overflow-hidden flex flex-col ${!currentConversation && 'hidden lg:flex'}`}>
                    {!currentConversation && (
                        <div className="hidden md:flex items-center justify-center h-full bg-background/50">
                            <p className="text-sm sm:text-base text-foreground/50">Chọn một cuộc trò chuyện để bắt đầu</p>
                        </div>
                    )}
                    {currentConversation && (
                        <ChatContainer className="h-full w-full" onToggleSidebar={toggleSidebar} />
                    )}
                </main>
            </div>

            {/* MOBILE: Chat List Drawer */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild className="lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="fixed bottom-24 left-4 lg:hidden z-40 h-9 w-9 sm:h-10 sm:w-10"
                        onClick={toggleSidebar}
                    >
                        <Menu className="size-4 sm:size-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                    <Sidebar className="h-full" />
                </SheetContent>
            </Sheet>

            {/* MOBILE: Show Chat List when no conversation selected */}
            {!currentConversation && (
                <div className="flex-1 lg:hidden flex flex-col overflow-hidden pb-20">
                    <Sidebar className="h-full" />
                </div>
            )}
        </div>
    );
};

export default ConversationPage;
