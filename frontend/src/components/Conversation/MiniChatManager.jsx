import React, { createContext, useContext, useState, useCallback } from 'react';
import MiniChatWindow from './MiniChatWindow';

const MiniChatContext = createContext();

export const useMiniChat = () => {
    const context = useContext(MiniChatContext);
    if (!context) {
        throw new Error('useMiniChat must be used within MiniChatProvider');
    }
    return context;
};

export const MiniChatProvider = ({ children, maxChats = 3 }) => {
    const [openChats, setOpenChats] = useState([]);

    const openChat = useCallback((friend) => {
        setOpenChats((prev) => {
            // Kiểm tra đã mở chat này chưa
            const exists = prev.find(chat => chat._id === friend._id);
            if (exists) return prev;

            // Nếu đã đạt max, remove chat đầu tiên (oldest)
            if (prev.length >= maxChats) {
                return [...prev.slice(1), friend];
            }

            return [...prev, friend];
        });
    }, [maxChats]);

    const closeChat = useCallback((friendId) => {
        setOpenChats((prev) => prev.filter(chat => chat._id !== friendId));
    }, []);

    const closeAllChats = useCallback(() => {
        setOpenChats([]);
    }, []);

    return (
        <MiniChatContext.Provider value={{ openChat, closeChat, closeAllChats }}>
            {children}

            {/* Render mini chat windows */}
            {openChats.map((friend, index) => (
                <MiniChatWindow
                    key={friend._id}
                    friend={friend}
                    position={index}
                    onClose={() => closeChat(friend._id)}
                />
            ))}
        </MiniChatContext.Provider>
    );
};

export default MiniChatProvider;
