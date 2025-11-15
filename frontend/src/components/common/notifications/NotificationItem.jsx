import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Heart, MessageCircle, UserPlus, X } from "lucide-react";

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

export default NotificationItem;
