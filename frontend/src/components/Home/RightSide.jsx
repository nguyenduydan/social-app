import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserCheck } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const RightSide = () => {
    const recommended = [
        { id: 1, name: "Lê Hữu Tài", username: "lehuutai", avatar: "https://i.pravatar.cc/100?img=1" },
        { id: 2, name: "Trần Minh Tuấn", username: "minhtuan", avatar: "https://i.pravatar.cc/100?img=2" },
        { id: 3, name: "Ngọc Anh", username: "ngocanh", avatar: "https://i.pravatar.cc/100?img=3" },
        { id: 4, name: "Ngọc Anh", username: "ngocanh", avatar: "https://i.pravatar.cc/100?img=3" },
        { id: 5, name: "Ngọc Anh", username: "ngocanh", avatar: "https://i.pravatar.cc/100?img=3" },
        { id: 6, name: "Ngọc Anh", username: "ngocanh", avatar: "https://i.pravatar.cc/100?img=3" },
    ];

    const requests = [
        { id: 1, name: "Phạm Thảo", username: "thaopham", avatar: "https://i.pravatar.cc/100?img=5" },
        { id: 2, name: "Lê Đức", username: "leduc", avatar: "https://i.pravatar.cc/100?img=6" },
        { id: 3, name: "Lê Đức", username: "leduc", avatar: "https://i.pravatar.cc/100?img=6" },
        { id: 4, name: "Lê Đức", username: "leduc", avatar: "https://i.pravatar.cc/100?img=6" },
        { id: 5, name: "Lê Đức", username: "leduc", avatar: "https://i.pravatar.cc/100?img=6" },
    ];

    const friends = [
        { id: 1, name: "Huy Hoàng", username: "huyhoang", avatar: "https://i.pravatar.cc/100?img=10" },
        { id: 2, name: "Thuý Vy", username: "thuyvy", avatar: "https://i.pravatar.cc/100?img=11" },
        { id: 3, name: "Đức Mạnh", username: "ducmanh", avatar: "https://i.pravatar.cc/100?img=12" },
        { id: 4, name: "Đức Mạnh", username: "ducmanh", avatar: "https://i.pravatar.cc/100?img=12" },
        { id: 5, name: "Đức Mạnh", username: "ducmanh", avatar: "https://i.pravatar.cc/100?img=12" },
        { id: 6, name: "Đức Mạnh", username: "ducmanh", avatar: "https://i.pravatar.cc/100?img=12" },
        { id: 7, name: "Đức Mạnh", username: "ducmanh", avatar: "https://i.pravatar.cc/100?img=12" },
        { id: 8, name: "Đức Mạnh", username: "ducmanh", avatar: "https://i.pravatar.cc/100?img=12" },
        { id: 9, name: "Đức Mạnh", username: "ducmanh", avatar: "https://i.pravatar.cc/100?img=12" },
    ];

    return (
        <div className="flex flex-col w-full">
            {/* --- Gợi ý theo dõi --- */}
            <Card className="p-4 bg-background rounded-none border-none">
                <h3 className="font-semibold text-lg px-4">Gợi ý theo dõi</h3>
                <ScrollArea className="h-[165px]">
                    <div className="grid grid-cols-1 gap-3 overflow-auto overflow-y-auto px-4">
                        {recommended.map((user) => (
                            <div key={user.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-9">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-tight">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="gap-1 text-xs font-medium"
                                >
                                    <UserPlus className="size-4" />
                                    Theo dõi
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* --- Lời mời kết bạn --- */}
            <Card className="p-4 bg-background rounded-none border-y-1 border-muted">
                <h3 className="font-semibold text-lg px-4">Lời mời kết bạn</h3>
                <ScrollArea className="h-[150px]">
                    <div className="grid grid-cols-1 gap-3 overflow-auto overflow-y-auto px-4">
                        {requests.map((user) => (
                            <div key={user.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-9">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-tight">{user.name}</p>
                                        <p className="text-xs text-muted-foreground">@{user.username}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" className="text-xs font-medium">
                                        <UserCheck className="size-4 mr-1" />
                                        Chấp nhận
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs font-medium text-destructive"
                                    >
                                        Từ chối
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            {/* --- Danh sách bạn bè --- */}

            <Card className="p-4 bg-background rounded-none shadow-none">
                <h3 className="font-semibold text-lg px-4">Danh sách bạn bè</h3>
                <ScrollArea className="h-[360px]">
                    <div className="grid grid-cols-1 gap-3 overflow-auto overflow-y-auto px-4">
                        {friends.map((f) => (
                            <div key={f.id} className="flex flex-row items-center text-left">
                                <Avatar className="size-12">
                                    <AvatarImage src={f.avatar} alt={f.name} />
                                    <AvatarFallback>{f.name[0]}</AvatarFallback>
                                </Avatar>
                                <p className="text-xs pl-2 font-medium truncate w-full">{f.name}</p>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
};

export default RightSide;
