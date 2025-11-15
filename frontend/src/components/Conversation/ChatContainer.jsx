import React from 'react';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import Messager from './Messager';
import EmptyChatState from './EmptyChatState';
import useConversationStore from '@/store/useConversationStore';

const ChatContainer = ({ className }) => {
    const { currentConversation } = useConversationStore();

    // Nếu chưa chọn conversation, hiển thị empty state
    if (!currentConversation) {
        return (
            <aside className={`flex flex-col ${className}`}>
                <EmptyChatState />
            </aside>
        );
    }

    return (
        <aside className={`flex flex-col  bg-muted ${className}`}>
            {/* Chat Header */}
            <div className=' bg-transition border-b '>
                <ChatHeader />
            </div>
            {/* Messager */}
            <div className='flex-1 overflow-hidden bg-transition'>
                <Messager />
            </div>
            {/* MessagerInput */}
            <div className='px-8 py-4  bg-transition'>
                <MessageInput />
            </div>
        </aside>
    );
};

export default ChatContainer;
