import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "../ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import useConversationStore from "@/store/useConversationStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMiniChat } from "../Conversation/MiniChatManager";

const FriendList = ({ friends = [], loading }) => {
    const navigate = useNavigate();
    const { openChat } = useMiniChat();
    const { conversations } = useConversationStore();
    const { user: currentUser } = useAuthStore();

    // Helper để lấy unread count cho friend
    const getUnreadCount = (friendId) => {
        const conversation = conversations.find(conv =>
            conv.type === 'direct' &&
            conv.participants.some(p => p.userId?._id === friendId)
        );

        if (!conversation) return 0;
        return conversation.unreadCounts?.[currentUser?._id] || 0;
    };

    const handleOpenChat = (friend, e) => {
        e.stopPropagation();
        openChat(friend);
    };

    const handleNavigateProfile = (friend, e) => {
        e.stopPropagation();
        navigate(`/profile/${friend.username}`, {
            state: { userId: friend._id },
        });
    };

    if (loading) {
        return (
            <div className="p-4 flex items-center gap-4 justify-center">
                <Spinner /> Đang tải...
            </div>
        );
    }

    return (
        <Card className="p-4 bg-background rounded-none shadow-none">
            <h3 className="font-semibold text-lg px-4">Danh sách bạn bè</h3>

            <ScrollArea className="h-[450px]">
                <div className="flex flex-col gap-0 px-4">
                    {friends.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            Bạn chưa có bạn bè nào.
                        </p>
                    ) : (
                        friends.map((f) => {
                            const unreadCount = getUnreadCount(f._id);

                            return (
                                <div
                                    key={f._id}
                                    className="flex items-center justify-between gap-3 hover:bg-card p-2 rounded-md cursor-pointer transition-colors group"
                                    onClick={(e) => handleOpenChat(f, e)}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="relative flex-shrink-0">
                                            <Avatar className="size-10">
                                                <AvatarImage
                                                    src={f.avatar || ""}
                                                    alt={f.displayName || f.email}
                                                />
                                                <AvatarFallback>
                                                    {(f.displayName || f.email || "?")[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* Online indicator */}
                                            {f.isOnline && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                                            )}
                                        </div>

                                        <div className="flex flex-col truncate flex-1">
                                            <p
                                                className="font-medium w-[fit-content] text-base truncate hover:underline hover:text-primary transition-colors"
                                                onClick={(e) => handleNavigateProfile(f, e)}
                                            >
                                                {f.displayName || "Người dùng ẩn danh"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {f.isOnline ? 'Đang hoạt động' : 'Offline'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Unread badge */}
                                    {unreadCount > 0 && (
                                        <Badge
                                            variant="destructive"
                                            className="h-5 min-w-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center"
                                        >
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default FriendList;
