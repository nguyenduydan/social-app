import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isToday, isYesterday, differenceInMinutes } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import useConversationStore from '@/store/useConversationStore';
import { useAuthStore } from '@/store/useAuthStore';
import CuberLoader from '../common/loaders/CuberLoader';
import formatTime from '@/utils/formatTime';

const Messager = () => {
    const scrollRef = useRef(null);
    const {
        currentConversation,
        messages,
        loading,
        fetchMessages,
        hasMore,
    } = useConversationStore();
    const { user: currentUser } = useAuthStore();

    const currentMessages = currentConversation
        ? messages[currentConversation._id] || []
        : [];

    // Auto scroll to bottom when new message
    useEffect(() => {
        if (scrollRef.current && currentMessages.length > 0) {
            // scrollRef is the anchor div at the bottom
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [currentMessages]);

    const formatMessageTime = (date) => {
        if (!date) return '';
        const messageDate = new Date(date);

        if (isToday(messageDate)) {
            return format(messageDate, 'HH:mm');
        } else if (isYesterday(messageDate)) {
            return `Hôm qua ${format(messageDate, 'HH:mm')}`;
        } else {
            return format(messageDate, 'dd/MM/yyyy HH:mm', { locale: vi });
        }
    };

    // normalize sender id for a message (supports message.sender._id, message.sender (id), legacy senderId)
    const getMessageSenderId = (message) => {
        if (!message) return null;
        return message.sender?._id || message.sender || message.senderId || null;
    };

    const shouldShowAvatar = (message, index) => {
        if (index === currentMessages.length - 1) return true;

        const nextMessage = currentMessages[index + 1];
        if (!nextMessage) return true;

        const nextSender = getMessageSenderId(nextMessage);
        const curSender = getMessageSenderId(message);

        if (String(nextSender) !== String(curSender)) return true;

        // Show avatar if time gap > 5 minutes
        const timeDiff = differenceInMinutes(
            new Date(nextMessage.createdAt || nextMessage.createdAt),
            new Date(message.createdAt || message.createdAt)
        );

        return timeDiff > 5;
    };

    const shouldShowTime = (message, index) => {
        if (index === 0) return true;

        const prevMessage = currentMessages[index - 1];
        if (!prevMessage) return true;

        const prevSender = getMessageSenderId(prevMessage);
        const curSender = getMessageSenderId(message);

        if (String(prevSender) !== String(curSender)) return true;

        // Show time if time gap > 5 minutes
        const timeDiff = differenceInMinutes(
            new Date(message.createdAt),
            new Date(prevMessage.createdAt)
        );

        return timeDiff > 5;
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getSenderInfo = (senderId) => {
        if (!currentConversation) return null;

        // participants may be either user objects or { userId: {...} } depending on backend
        const participant = currentConversation.participants?.find((p) => {
            const pid = p._id || p.userId?._id;
            return pid && String(pid) === String(senderId);
        });

        // avatar might be stored as { url } or string
        const avatar = participant?.avatar?.url || participant?.avatar || participant?.userId?.avatar?.url || null;
        const name = participant?.displayName || participant?.userId?.displayName || 'Unknown';

        return {
            name,
            avatar
        };
    };

    if (!currentConversation) {
        return (
            <div className='flex items-center justify-center h-full'>
                <p className='text-sm text-muted-foreground'>
                    Chọn một cuộc trò chuyện để xem tin nhắn
                </p>
            </div>
        );
    }

    if (loading && currentMessages.length === 0) {
        return (
            <div className='flex items-center justify-center h-full'>
                <CuberLoader />
            </div>
        );
    }

    if (currentMessages.length === 0) {
        return (
            <div className='flex items-center justify-center h-full'>
                <p className='text-sm text-muted-foreground'>
                    Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                </p>
            </div>
        );
    }

    return (
        <ScrollArea className='h-full px-8 py-2'>
            <div className='flex flex-col gap-1'>
                {currentMessages.map((message, index) => {
                    const senderId = getMessageSenderId(message);
                    const isSent = String(senderId) === String(currentUser?._id);
                    const showAvatar = shouldShowAvatar(message, index);
                    const showTime = shouldShowTime(message, index);
                    const senderInfo = getSenderInfo(senderId);

                    return (
                        <div key={message._id}>
                            {/* Time separator */}
                            {showTime && (
                                <div className='flex justify-center my-3'>
                                    <span className='text-xs text-muted-foreground px-3 py-1 rounded-full bg-muted/50'>
                                        {formatMessageTime(message.createdAt)}
                                    </span>
                                </div>
                            )}

                            {/* Message */}
                            <div className={cn(
                                'flex gap-2 mb-1 items-end',
                                isSent ? 'flex-row-reverse' : 'flex-row'
                            )}>
                                {/* Avatar */}
                                <div className='flex-shrink-0 w-8'>
                                    {!isSent && showAvatar ? (
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={senderInfo?.avatar}
                                                alt={senderInfo?.name}
                                            />
                                            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {getInitials(senderInfo?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : null}
                                </div>

                                {/* Message container */}
                                <div
                                    className={cn(
                                        'flex flex-col max-w-[60%]',
                                        isSent ? 'items-end self-end' : 'items-start self-start'
                                    )}
                                >
                                    {/* Tên người gửi (nếu là nhóm) */}
                                    {!isSent && currentConversation.type === 'group' && showAvatar && (
                                        <span className='text-xs text-muted-foreground mb-1 px-3'>
                                            {senderInfo?.name}
                                        </span>
                                    )}

                                    {/* Bong bóng tin nhắn */}
                                    <div
                                        className={cn(
                                            'inline-flex flex-col w-full px-3 py-2 rounded-2xl font-medium',
                                            isSent
                                                ? 'bg-chat-bubble-sent text-chat-bubble-sent-foreground rounded-br-xs'
                                                : 'bg-chat-bubble-received text-chat-bubble-received-foreground rounded-bl-xs'
                                        )}
                                    >
                                        {/* Nội dung tin nhắn */}
                                        <p className='text-sm whitespace-pre-wrap break-words'>
                                            {message.content}
                                        </p>

                                        {/* Footer: thời gian + trạng thái */}
                                        <div
                                            className={cn(
                                                'flex items-center gap-1 mt-1 text-[11px] opacity-70',
                                                isSent ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            <span className='text-muted-foreground'>
                                                {formatTime(message.createdAt)}
                                            </span>

                                            {/* Dấu đã đọc (icon hoặc tick) */}
                                            {isSent && (
                                                <>
                                                    {message.status === 'sent' && (
                                                        <span className='text-muted-foreground'>✓</span>
                                                    )}
                                                    {message.status === 'delivered' && (
                                                        <span className='text-muted-foreground'>✓✓</span>
                                                    )}
                                                    {message.status === 'read' && (
                                                        <span className='text-blue-400'>✓✓</span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Load more indicator */}
                {hasMore[currentConversation._id] && (
                    <div className='flex justify-center py-2'>
                        <button
                            className='text-xs text-primary hover:underline'
                            onClick={() => fetchMessages(currentConversation._id, true)}
                        >
                            Tải thêm tin nhắn
                        </button>
                    </div>
                )}

                {/* Auto scroll anchor */}
                <div ref={scrollRef} />
            </div>
        </ScrollArea>
    );
};

export default Messager;
