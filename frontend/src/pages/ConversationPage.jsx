import React from "react";
import Sidebar from "../components/Conversation/Sidebar";
import ChatContainer from "../components/Conversation/ChatContainer";

const ConversationPage = () => {
    return (
        <div className="container px-0 h-[calc(100vh-50px)]  md:h-[calc(100vh-60px)] w-full flex overflow-hidden bg-muted">
            {/* Sidebar */}
            <Sidebar className="w-full md:w-1/3 min-w-[280px] border-r border-border" />

            {/* Chat Container */}
            <ChatContainer className="flex-1 h-full" />
        </div>
    );
};

export default ConversationPage;
