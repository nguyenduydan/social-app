import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { useNavigate } from "react-router";

const FollowSuggestions = ({ users = [], loading }) => {
    const navigate = useNavigate();

    if (loading)
        return (
            <div className="p-4 flex items-center gap-4 justify-center">
                <Spinner /> Đang tải...
            </div>
        );

    return (
        <Card className="p-4 bg-background shadow-none rounded-none border-b-1 border-muted">
            <h3 className="font-semibold text-lg px-4">Gợi ý theo dõi</h3>
            <ScrollArea className="h-[250px]">
                <div className="grid grid-cols-1 gap-3 px-4">
                    {users.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            Không có đề xuất theo dõi nào.
                        </p>
                    ) : (
                        users.map((user) => (
                            <div key={user._id} className="flex items-center justify-between group hover:bg-card p-2 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <Avatar className="size-9">
                                        <AvatarImage src={user.avatar?.url || ""} alt={user?.displayName || "not found"} />
                                        <AvatarFallback>{user?.displayName[0] || ""}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p
                                            className="text-sm font-medium truncate cursor-pointer hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/profile/${user.username}`, {
                                                    state: { userId: user._id },
                                                });
                                            }}
                                        >{user?.displayName || ""}</p>
                                        <p className="text-xs text-muted-foreground">@{user?.username || ""}</p>
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
                        ))
                    )}
                </div>
            </ScrollArea>
        </Card>
    );
};

export default FollowSuggestions;
