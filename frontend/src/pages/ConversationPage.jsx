import React from "react";
import Sidebar from "../components/Conversation/Sidebar";
import ChatContainer from "../components/Conversation/ChatContainer";

const ConversationPage = () => {
    return (
        <div className="container px-0 h-[calc(100vh-58px)] w-full flex overflow-hidden bg-muted">
            {/* Sidebar */}
            <Sidebar className="w-1/3 min-w-[280px] border-r border-border" />

            {/* Chat Container */}
            <ChatContainer className="flex-1 h-full" />
        </div>
    );
};

export default ConversationPage;
