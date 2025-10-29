import React from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router";

const FriendList = ({ friends = [], loading }) => {
    const navigate = useNavigate();

    if (loading)
        return (
            <div className="p-4 flex items-center gap-4 justify-center">
                <Spinner /> Đang tải...
            </div>
        );

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
                        friends.map((f) => (
                            <div
                                key={f._id}
                                className="flex items-center justify-between gap-3 hover:bg-card p-2 rounded-md cursor-pointer transition"
                            >
                                <div className="flex items-center gap-3">
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
                                            className="font-medium text-lg truncate hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/profile/${f.username}`, {
                                                    state: { userId: f._id },
                                                });
                                            }}
                                        >
                                            {f.displayName || "Người dùng ẩn danh"}
                                        </p>
                                    </div>
                                </div>

                                {/* Số tin nhắn chưa đọc (tạm cứng) */}
                                <strong className="rounded-full bg-destructive h-5 w-5 mr-10 text-center text-sm text-white">
                                    1
                                </strong>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default FriendList;
