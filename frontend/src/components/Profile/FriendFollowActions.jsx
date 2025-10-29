import { useEffect } from "react";
import { UserPlus, UserCheck, UserMinus, Check, X } from "lucide-react";
import { Button } from "../ui/button";
import { useFriendStore } from "@/store/useFriendStore";

const FriendFollowActions = ({ userId, className = "" }) => {
    const {
        friendStatus,
        friendshipId,
        isRequester,
        loading,
        sendFriendRequest,
        cancelFriendRequest,
        unfriend,
        acceptFriendRequest,
        rejectFriendRequest,
        checkFriendStatus,
    } = useFriendStore();

    useEffect(() => {
        if (!userId) return;
        checkFriendStatus(userId);
    }, [userId, checkFriendStatus]);

    if (!friendStatus) return null;

    return (
        <div className={`flex gap-2 ${className}`}>
            {/* Chưa kết bạn hoặc đã bị từ chối */}
            {(friendStatus === "none" || friendStatus === "rejected") && (
                <Button
                    onClick={() => sendFriendRequest(userId)}
                    disabled={loading}
                    className="gap-2"
                >
                    <UserPlus className="h-4 w-4" />
                    Kết bạn
                </Button>
            )}

            {/* Đang chờ phản hồi */}
            {friendStatus === "pending" && (
                <>
                    {isRequester ? (
                        // Nếu là người gửi
                        <Button
                            onClick={() => cancelFriendRequest(friendshipId || userId)}
                            disabled={loading}
                            variant="secondary"
                            className="gap-2"
                        >
                            <UserMinus className="h-4 w-4" />
                            Hủy lời mời
                        </Button>
                    ) : (
                        // Nếu là người nhận
                        <>
                            <Button
                                onClick={() => acceptFriendRequest(friendshipId)}
                                disabled={loading}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <Check className="h-4 w-4" />
                                Chấp nhận
                            </Button>
                            <Button
                                onClick={() => rejectFriendRequest(friendshipId)}
                                disabled={loading}
                                variant="outline"
                                className="gap-2 text-destructive"
                            >
                                <X className="h-4 w-4" />
                                Từ chối
                            </Button>
                        </>
                    )}
                </>
            )}

            {/* Đã là bạn bè */}
            {friendStatus === "accepted" && (
                <Button
                    onClick={() => unfriend(friendshipId || userId)}
                    disabled={loading}
                    variant="outline"
                    className="gap-2"
                >
                    <UserCheck className="h-4 w-4 text-green-600" />
                    Bạn bè
                </Button>
            )}
        </div>
    );
};

export default FriendFollowActions;
