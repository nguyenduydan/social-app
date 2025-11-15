import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import NotificationItem from "./NotificationItem";
import AnimatedIcon from "./AnimatedIcon";

import { NotificationSkeletonList } from "./NotificationSkeleton";

const Notification = () => {
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState([]);

    // Simulate API loading
    useEffect(() => {
        setTimeout(() => {
            setNotifications([
                {
                    id: 1,
                    type: 'like',
                    userName: 'Nguyễn Văn A',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
                    message: 'đã thích bài viết của bạn',
                    postContent: 'Hôm nay thật là một ngày tuyệt vời!',
                    time: '5 phút trước',
                    read: false
                },
                {
                    id: 2,
                    type: 'comment',
                    userName: 'Trần Thị B',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
                    message: 'đã bình luận về bài viết của bạn',
                    postContent: 'Chia sẻ về chuyến du lịch Đà Lạt',
                    time: '15 phút trước',
                    read: false
                },
                {
                    id: 3,
                    type: 'friend_request',
                    userName: 'Lê Văn C',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
                    message: 'đã gửi lời mời kết bạn',
                    time: '30 phút trước',
                    read: false,
                    responded: false
                }
            ]);
            setLoading(false);
        }, 300);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleDelete = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleClearAll = () => {
        setNotifications([]);
    };

    const handleAcceptFriend = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, responded: true, read: true } : n
        ));
    };

    const handleRejectFriend = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <TooltipProvider>
            <Popover>
                <PopoverTrigger asChild>
                    <div>
                        <AnimatedIcon
                            icon={<Bell />}
                            label="Thông báo"
                            badgeCount={unreadCount}
                        />
                    </div>
                </PopoverTrigger>

                <PopoverContent className="w-100 p-0 pb-5" align="end">
                    <div className="flex items-center justify-between p-4">
                        <h3 className="font-semibold">Thông báo</h3>

                        {!loading && notifications.length > 0 && (
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleMarkAllAsRead}
                                        className="h-8 text-xs"
                                    >
                                        Đánh dấu đã đọc
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="h-8 text-xs text-destructive hover:text-destructive"
                                >
                                    Xóa tất cả
                                </Button>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* LOADING STATE */}
                    {loading ? (
                        <ScrollArea className="h-[400px]">
                            <NotificationSkeletonList />
                        </ScrollArea>
                    ) : notifications.length > 0 ? (
                        <ScrollArea className="h-[400px]">
                            {notifications.map((notification, index) => (
                                <React.Fragment key={notification.id}>
                                    <NotificationItem
                                        notification={notification}
                                        onDelete={handleDelete}
                                        onAcceptFriend={handleAcceptFriend}
                                        onRejectFriend={handleRejectFriend}
                                    />
                                    {index < notifications.length - 1 && <Separator />}
                                </React.Fragment>
                            ))}
                        </ScrollArea>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <Bell className="mx-auto h-12 w-12 mb-2 opacity-20" />
                            <p className="text-sm">Không có thông báo</p>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    );
};

export default Notification;
