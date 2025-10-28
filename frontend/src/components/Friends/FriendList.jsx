import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriendStore } from "@/store/useFriendStore";
import { useNavigate } from "react-router";

const FriendList = () => {
    const { friends, getFriendAll, loading } = useFriendStore();
    const navigate = useNavigate();

    useEffect(() => {
        getFriendAll(1);
    }, [getFriendAll]);

    if (loading) return <p className="p-4">Đang tải...</p>;

    return (
        <Card className="p-4 bg-background rounded-none shadow-none">
            <h3 className="font-semibold text-lg px-4">Danh sách bạn bè</h3>
            <ScrollArea className="h-[380px]">
                <div className="flex flex-col gap-0 px-4">
                    {friends.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                            Bạn chưa có bạn bè nào.
                        </p>
                    ) : (
                        friends.map((f) => (
                            <div
                                key={f._id}
                                className="flex items-center gap-3 hover:bg-primary-glow p-2 rounded-md cursor-pointer transition"
                            >
                                <Avatar className="size-10">
                                    <AvatarImage
                                        src={f.avatar || ""}
                                        alt={f.displayName || f.email}
                                    />
                                    <AvatarFallback>
                                        {(f.displayName || f.email || "?")[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col truncate">
                                    <p
                                        className="font-medium text-sm truncate hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/profile/${f.username}`, {
                                                state: { userId: f._id },
                                            });
                                        }}
                                    >
                                        {f.displayName || "Người dùng ẩn danh"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        @{f.username}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default FriendList;
