import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import useConversationStore from "@/store/useConversationStore";
import { cn } from "@/lib/utils";

const UserList = () => {
    const {
        conversations,
        currentConversation,
        loading,
        error,
        setCurrentConversation,
        fetchConversations,
        getFilteredConversations,
        getConversationInfo,
        markAsRead
    } = useConversationStore();

    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

    const filteredConversations = getFilteredConversations();

    const formatTime = (date) => {
        if (!date) return "";
        try {
            return formatDistanceToNow(new Date(date), {
                addSuffix: true,
                locale: vi
            });
        } catch {
            return "";
        }
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

    if (loading && conversations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="size-5 sm:size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-destructive text-center">{error}</p>
            </div>
        );
    }

    if (filteredConversations.length === 0) {
        return (
            <div className="flex items-center justify-center h-full p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                    Không có cuộc trò chuyện nào
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-1.5 sm:space-y-2">
            {filteredConversations.map((conversation) => {
                const info = getConversationInfo(conversation, currentUser?._id);
                const isActive = currentConversation?._id === conversation._id;
                const unreadCount = conversation.unreadCounts?.[currentUser?._id] || 0;

                return (
                    <div
                        key={conversation._id}
                        onClick={() => {
                            setCurrentConversation(conversation);
                            markAsRead(conversation._id, currentUser?._id);
                        }}
                        className={`
                            group relative rounded-md cursor-pointer
                            transition-all duration-200
                            p-2 sm:p-3
                            ${isActive
                                ? 'bg-primary/10 border border-primary/20'
                                : 'hover:bg-muted border border-transparent'
                            }
                        `}
                    >
                        <div className="flex items-start gap-2 sm:gap-3">
                            {/* Avatar - Responsive size */}
                            <div className="relative flex-shrink-0">
                                <Avatar className="h-10 w-10 sm:h-11 sm:w-11">
                                    <AvatarImage
                                        src={info?.avatar}
                                        alt={info?.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs sm:text-sm">
                                        {getInitials(info?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                {/* Online indicator */}
                                {info?.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 border-2 border-background rounded-full" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                    <h4 className={`
                                        font-medium truncate text-sm sm:text-base
                                        ${isActive ? 'text-primary' : 'text-foreground'}
                                        ${unreadCount > 0 ? 'font-semibold' : ''}
                                    `}>
                                        {info?.name}
                                    </h4>
                                    {conversation.lastMessageAt && (
                                        <span className={`
                                            text-[10px] sm:text-xs flex-shrink-0
                                            ${unreadCount > 0
                                                ? 'text-primary font-medium'
                                                : 'text-muted-foreground'
                                            }
                                        `}>
                                            {formatTime(conversation.lastMessageAt)}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                                    <p
                                        className={cn(
                                            'text-xs sm:text-sm truncate',
                                            unreadCount > 0
                                                ? 'text-foreground font-medium'
                                                : 'text-muted-foreground'
                                        )}
                                    >
                                        {conversation.lastMessage?.content
                                            ? conversation.lastMessage.content.length > 40
                                                ? conversation.lastMessage.content.slice(0, 40) + '...'
                                                : conversation.lastMessage.content
                                            : 'Chưa có tin nhắn'}
                                    </p>

                                    {/* Unread badge */}
                                    {unreadCount > 0 && (
                                        <Badge
                                            variant="default"
                                            className="h-4 sm:h-5 min-w-4 sm:min-w-5 px-1 sm:px-1.5 rounded-full text-[10px] sm:text-xs font-semibold flex items-center justify-center flex-shrink-0"
                                        >
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UserList;
