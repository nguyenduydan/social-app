import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserCheck, X } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useFriendStore } from "@/store/useFriendStore";
import { useNavigate } from "react-router";

const FriendRequests = ({ requests = [], loading }) => {
    const { acceptFriendRequest, rejectFriendRequest, getRequest } = useFriendStore();
    const navigate = useNavigate();

    const handleAccept = async (friendshipId) => {
        await acceptFriendRequest(friendshipId);
        getRequest(1, false); // làm mới danh sách
    };

    const handleReject = async (friendshipId) => {
        await rejectFriendRequest(friendshipId);
        getRequest(1, false);
    };

    if (loading)
        return (
            <div className="p-4 flex items-center gap-4 justify-center">
                <Spinner /> Đang tải...
            </div>
        );

    return (
        <Card className="p-4 bg-background shadow-none rounded-none border-t border-muted">
            <h3 className="font-semibold text-lg px-4">Lời mời kết bạn</h3>
            <ScrollArea className="h-[140px]">
                <div className="grid grid-cols-1 gap-3 px-4">
                    {requests.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Không có lời mời kết bạn nào.
                        </p>
                    ) : (
                        requests.map((req) => (
                            <div
                                key={req._id}
                                className="flex items-center justify-between group hover:bg-card p-2 rounded-xl"
                            >
                                <div className="flex items-center gap-3 ">
                                    <Avatar className="size-9">
                                        <AvatarImage
                                            src={req.requester?.avatar?.url || ""}
                                            alt={req.requester?.displayName}
                                        />
                                        <AvatarFallback>
                                            {req.requester?.displayName?.[0] || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col" >
                                        <p className="font-medium text-lg truncate hover:underline cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/profile/${req.requester?.username}`, {
                                                    state: { userId: req.requester?._id },
                                                });
                                            }}>
                                            {req.requester?.displayName || "Người dùng"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            @{req.requester?.username}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        className="text-xs font-medium"
                                        onClick={() => handleAccept(req.friendshipId)}
                                    >
                                        <UserCheck className="size-4 mr-1" />
                                        Chấp nhận
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs font-medium text-destructive"
                                        onClick={() => handleReject(req.friendshipId)}
                                    >
                                        <X className="size-4 mr-1" />
                                        Từ chối
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default FriendRequests;
