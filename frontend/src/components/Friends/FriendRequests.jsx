import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useFriendStore } from "@/store/useFriendStore";
import { useNavigate } from "react-router";

const FriendRequests = ({ requests = [], loading }) => {
    const { acceptFriendRequest, rejectFriendRequest, getRequests } = useFriendStore();
    const [loadingActionId, setLoadingActionId] = useState(null);
    const navigate = useNavigate();

    const handleAccept = async (requestId) => {
        setLoadingActionId(requestId);
        await acceptFriendRequest(requestId);
        await getRequests("received", 1, false); // Làm mới danh sách
        setLoadingActionId(null);
    };

    const handleReject = async (requestId) => {
        setLoadingActionId(requestId);
        await rejectFriendRequest(requestId);
        await getRequests("received", 1, false);
        setLoadingActionId(null);
    };

    // Loading lần đầu
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
                        requests.map((req) => {
                            const isProcessing = loadingActionId === req.requestId;
                            return (
                                <div
                                    key={req.requestId}
                                    className="flex items-center justify-between group hover:bg-card p-2 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="size-9">
                                            <AvatarImage
                                                src={req.requester?.avatar?.url || ""}
                                                alt={req.requester?.displayName}
                                            />
                                            <AvatarFallback>
                                                {req.requester?.displayName?.[0] || "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p
                                                className="font-medium text-sm hover:underline cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/profile/${req.requester?.username}`, {
                                                        state: { userId: req.requester?._id },
                                                    });
                                                }}
                                            >
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
                                            disabled={isProcessing}
                                            onClick={() => handleAccept(req.requestId)}
                                        >
                                            {isProcessing ? (
                                                <Spinner className="size-3" />
                                            ) : (
                                                <Check className="size-4" />
                                            )}
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs font-medium text-destructive"
                                            disabled={isProcessing}
                                            onClick={() => handleReject(req.requestId)}
                                        >
                                            {isProcessing ? (
                                                <Spinner className="size-3" />
                                            ) : (
                                                <X className="size-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default FriendRequests;
