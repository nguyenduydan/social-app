import React, { useState } from "react";
import Sidebar from "../components/Conversation/Sidebar";
import ChatContainer from "../components/Conversation/ChatContainer";
import useConversationStore from "@/store/useConversationStore";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
        <div className="container flex h-[calc(100vh-50px)]  md:h-[calc(100vh-60px)] w-full overflow-hidden bg-background">
            {/* Desktop Sidebar - Hidden on mobile/tablet */}
            <div className="hidden md:block w-80 lg:w-96 border-r">
                <Sidebar className="h-full" />
            </div>

            {/* Mobile/Tablet Sidebar - Sheet/Drawer */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetContent
                    side="left"
                    className="w-[280px] sm:w-[320px] p-0 border-r"
                    onInteractOutside={closeSidebar}
                >
                    <Sidebar className="h-full" />
                </SheetContent>
            </Sheet>

            {/* Chat Container - Full width on mobile when conversation selected */}
            <div className={`
                flex-1
                ${!currentConversation && 'hidden md:flex'}
            `}>
                <ChatContainer
                    className="h-full w-full"
                    onToggleSidebar={toggleSidebar}
                />
            </div>

            {/* Mobile: Show sidebar when no conversation selected */}
            {!currentConversation && (
                <div className="flex-1 md:hidden">
                    <Sidebar className="h-full" />
                </div>
            )}
        </div>
    );
};

export default ConversationPage;
