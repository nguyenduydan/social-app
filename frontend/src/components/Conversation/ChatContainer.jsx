import React from 'react';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import Messager from './Messager';

const ChatContainer = ({ className }) => {
    return (
        <aside className={`flex flex-col ${className}`}>
            {/* Chat Header */}
            <div className='flex-1 bg-card'>
                <ChatHeader />
            </div>
            {/* Messager */}
            <div className='flex-10'>
                <Messager />
            </div>
            {/* MessagerInput */}
            <div className='flex-1 px-8'>
                <MessageInput />
            </div>
        </aside>
    );
};

export default ChatContainer;
