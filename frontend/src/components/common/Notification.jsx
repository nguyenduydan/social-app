import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AnimatedIcon = ({ icon, label, onClick, badgeCount }) => {
    const sizedIcon = React.cloneElement(icon, {
        className: `size-5 md:size-6 ${icon.props.className || ''}`,
    });

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={onClick}
                    className="relative flex w-10 h-10 justify-center items-center rounded-full transition-transform duration-300 ease-out
                     text-foreground/60 dark:text-foreground/70 hover:text-foreground
                     hover:bg-secondary/40 dark:hover:bg-muted/50 hover:scale-110
                     active:scale-95"
                >
                    {sizedIcon}
                    {badgeCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {badgeCount > 9 ? '9+' : badgeCount}
                        </Badge>
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
};

const NotificationItem = ({ notification, onDelete, onAcceptFriend, onRejectFriend }) => {
    if (!notification) return null;

    const getIcon = () => {
        switch (notification.type) {
            case 'like':
                return <Heart className="h-4 w-4 text-red-500 fill-red-500" />;
            case 'comment':
                return <MessageCircle className="h-4 w-4 text-blue-500" />;
            case 'friend_request':
                return <UserPlus className="h-4 w-4 text-green-500" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    const userName = notification.userName || 'Người dùng';
    const avatarFallback = userName.charAt(0).toUpperCase();

    return (
        <div
            className={`p-3 hover:bg-accent/50 transition-colors ${!notification.read ? 'bg-accent/20' : ''
                }`}
        >
            <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.avatar} alt={userName} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                {getIcon()}
                                {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                )}
                            </div>
                            <p className="text-sm">
                                <span className="font-semibold">{userName}</span>
                                {' '}{notification.message || ''}
                            </p>
                            {notification.postContent && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 italic">
                                    "{notification.postContent}"
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                                {notification.time || ''}
                            </p>
                        </div>

                        {notification.type !== 'friend_request' && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => onDelete(notification.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {notification.type === 'friend_request' && !notification.responded && (
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                className="flex-1 h-8"
                                onClick={() => onAcceptFriend(notification.id)}
                            >
                                Chấp nhận
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="h-8"
                                onClick={() => onRejectFriend(notification.id)}
                            >
                                <X />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Notification = () => {
    const [notifications, setNotifications] = useState([
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
        },
        {
            id: 4,
            type: 'like',
            userName: 'Phạm Thị D',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
            message: 'đã thích bài viết của bạn',
            postContent: 'Công thức làm bánh flan ngon tuyệt Công thức làm bánh flan ngon tuyệ Công thức làm bánh flan ngon tuyệCông thức làm bánh flan ngon tuyệ',
            time: '1 giờ trước',
            read: false
        },
        {
            id: 5,
            type: 'comment',
            userName: 'Hoàng Văn E',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
            message: 'đã bình luận về bài viết của bạn',
            postContent: 'Tips học tiếng Anh hiệu quả',
            time: '2 giờ trước',
            read: true
        },
        {
            id: 6,
            type: 'friend_request',
            userName: 'Vũ Thị F',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
            message: 'đã gửi lời mời kết bạn',
            time: '3 giờ trước',
            read: true,
            responded: false
        }
    ]);

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
                        {notifications.length > 0 && (
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
                    {notifications.length > 0 ? (
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
