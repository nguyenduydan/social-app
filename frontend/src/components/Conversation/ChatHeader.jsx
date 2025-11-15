import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { FieldDescription } from "@/components/ui/field";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Search, X, Users, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import useConversationStore from "@/store/useConversationStore";
import { useAuthStore } from "@/store/useAuthStore";

const ChatHeader = () => {
    const [isSearch, setIsSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const searchRef = useRef(null);

    const { currentConversation, getConversationInfo } = useConversationStore();
    const { user: currentUser } = useAuthStore();

    const conversationInfo = getConversationInfo(currentConversation, currentUser?._id);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                !searchValue
            ) {
                setIsSearch(false);
            }
        };
        if (isSearch) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearch, searchValue]);

    const handleOpenSearch = () => setIsSearch(true);
    const handleCloseSearch = () => {
        setIsSearch(false);
        setSearchValue("");
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatLastSeen = (lastSeen) => {
        if (!lastSeen) return "Offline";
        try {
            return formatDistanceToNow(new Date(lastSeen), {
                addSuffix: true,
                locale: vi
            });
        } catch {
            return "Offline";
        }
    };

    const getActivityStatus = () => {
        if (!conversationInfo) return "";

        if (currentConversation?.type === 'group') {
            const memberCount = currentConversation.participants?.length || 0;
            return `${memberCount} thành viên`;
        }

        if (conversationInfo.isOnline) {
            return "Đang hoạt động";
        }

        return conversationInfo.lastSeen
            ? `Hoạt động ${formatLastSeen(conversationInfo.lastSeen)}`
            : "Offline";
    };

    if (!currentConversation) {
        return (
            <div className="flex px-8 py-3 justify-center items-center">
                <p className="text-sm text-muted-foreground">
                    Chọn một cuộc trò chuyện để bắt đầu
                </p>
            </div>
        );
    }

    return (
        <div className="flex px-8 py-3 justify-between items-center relative overflow-hidden border-b">
            {/* Avatar + Name */}
            <motion.div
                initial={{ opacity: 1, x: 0 }}
                animate={
                    isSearch
                        ? { opacity: 0, x: -20, width: 0 }
                        : { opacity: 1, x: 0, width: "auto" }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center gap-5 overflow-hidden min-w-0 flex-shrink"
            >
                <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-offset-4 ring-offset-background transition-all duration-300 hover:ring-primary/40 hover:scale-105">
                        <AvatarImage
                            src={conversationInfo?.avatar}
                            alt={conversationInfo?.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(conversationInfo?.name)}
                        </AvatarFallback>
                    </Avatar>
                    {currentConversation.type === 'direct' && conversationInfo?.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                </div>

                <div className="flex flex-col min-w-0">
                    <Label className="text-lg font-semibold truncate max-w-[180px]">
                        {conversationInfo?.name}
                    </Label>
                    <FieldDescription className="text-xs truncate max-w-[180px]">
                        {getActivityStatus()}
                    </FieldDescription>
                </div>
            </motion.div>

            {/* Actions */}
            <div
                className={cn(
                    "flex items-center gap-3 transition-all duration-300 ease-in-out",
                    isSearch ? "flex-1" : "ml-auto"
                )}
            >
                <div
                    ref={searchRef}
                    className="flex items-center justify-end relative w-full "
                >
                    <AnimatePresence>
                        {isSearch && (
                            <motion.div
                                key="searchbar"
                                initial={{ width: 0, opacity: 0, x: 40 }}
                                animate={{ width: "100%", opacity: 1, x: 0 }}
                                exit={{ width: 0, opacity: 0, x: 40 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className="flex items-center"
                            >
                                <InputGroup className="h-10 shadow-lg bg-card dark:bg-card w-full ">
                                    <InputGroupInput
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder="Tìm kiếm tin nhắn..."
                                        autoFocus
                                        className="animate-in fade-in duration-300"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon"
                                            variant="ghost"
                                            onClick={handleCloseSearch}
                                            className=""
                                        >
                                            <X className="size-4 text-destructive" />
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nút Search */}
                <AnimatePresence>
                    {!isSearch && (
                        <motion.div
                            key="search-icon"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="group transition-all duration-300"
                                onClick={handleOpenSearch}
                            >
                                <Search className="size-6 group-hover:scale-110 transition-transform" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <EllipsisVertical className="size-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                        <DropdownMenuItem>
                            <Users className="size-4 mr-2" />
                            Thông tin cuộc trò chuyện
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Archive className="size-4 mr-2" />
                            Lưu trữ
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <Trash2 className="size-4 mr-2" />
                            Xóa cuộc trò chuyện
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default ChatHeader;
