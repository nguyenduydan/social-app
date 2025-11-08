import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InputGroup, InputGroupInput, InputGroupButton } from '@/components/ui/input-group';
import { X, Minus, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import useConversationStore from '@/store/useConversationStore';

const MiniChatWindow = ({ friend, onClose, position = 0 }) => {
    const [message, setMessage] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef(null);

    const {
        messages,
        sendDirectMessage,
        fetchMessages,
        conversations
    } = useConversationStore();

    const { user: currentUser } = useAuthStore();

    // Tìm conversation với friend này
    const conversation = conversations.find(conv =>
        conv.type === 'direct' &&
        conv.participants.some(p => p.userId?._id === friend._id)
    );

    const conversationMessages = conversation
        ? messages[conversation._id] || []
        : [];

    // Fetch messages khi mở chat
    useEffect(() => {
        if (conversation && !isMinimized) {
            fetchMessages(conversation._id);
        }
    }, [conversation, isMinimized]);

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current && !isMinimized) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversationMessages, isMinimized]);

    const handleSend = async () => {
        if (!message.trim() || isSending) return;

        setIsSending(true);
        try {
            await sendDirectMessage(
                friend._id,
                message,
                conversation?._id
            );
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Calculate position offset (320px width + 12px gap)
    const rightOffset = 16 + (position * 332);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 500, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    height: isMinimized ? 56 : 480 // 56px là chiều cao header
                }}
                exit={{ y: 500, opacity: 0 }}
                transition={{
                    type: 'spring',
                    damping: 25,
                    stiffness: 300,
                    mass: 0.8
                }}
                className="fixed bottom-0 w-80 bg-card border border-border rounded-t-lg shadow-2xl z-50 flex flex-col overflow-hidden"
                style={{ right: `${rightOffset}px` }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b bg-card/95 backdrop-blur-sm">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={friend.avatar} alt={friend.displayName} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getInitials(friend.displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                                {friend.displayName || 'User'}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {friend.isOnline ? 'Đang hoạt động' : 'Offline'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setIsMinimized(!isMinimized)}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages - Only render when not minimized */}
                {!isMinimized && (
                    <>
                        <ScrollArea
                            className="flex-1 p-3"
                            ref={scrollRef}
                        >
                            {conversationMessages.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-xs text-muted-foreground text-center">
                                        Bắt đầu cuộc trò chuyện
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {conversationMessages.map((msg) => {
                                        const isSent = msg.senderId === currentUser?._id;
                                        return (
                                            <div
                                                key={msg._id}
                                                className={cn(
                                                    'flex',
                                                    isSent ? 'justify-end' : 'justify-start'
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'max-w-[75%] px-3 py-2 rounded-2xl text-sm break-words',
                                                        isSent
                                                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                                                            : 'bg-muted text-foreground rounded-bl-sm'
                                                    )}
                                                >
                                                    <p className="whitespace-pre-wrap">
                                                        {msg.content}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-3 border-t bg-card/95 backdrop-blur-sm">
                            <InputGroup className="h-10">
                                <InputGroupInput
                                    placeholder="Aa"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={isSending}
                                    className="text-sm"
                                />
                                <InputGroupButton
                                    onClick={handleSend}
                                    disabled={!message.trim() || isSending}
                                    className="px-3"
                                >
                                    {isSending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </InputGroupButton>
                            </InputGroup>
                        </div>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default MiniChatWindow;
