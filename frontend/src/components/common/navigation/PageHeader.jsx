import { useState } from "react";
import { Bell, Edit, Search } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import CreatePost from "@/components/Posts/CreatePost";
import Notification from "../notifications/Notification";
import MenuSettings from "./MenuSettings";

const PageHeader = ({ showSearch = true, showActions = true, title = "" }) => {
    const { user, signOut } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const { themeMode, setTheme } = useThemeStore();

    const handleSignOut = () => signOut();
    const handleOpenPost = () => setOpen(true);
    const handleClosePost = () => setOpen(false);

    return (
        <div className="sticky top-0 h-14 sm:h-16 bg-background/80 backdrop-blur-sm border-b border-border/30 z-40 flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 gap-0">
            {/* Left: Title */}
            {title && (
                <h1 className="absolute left-3 sm:left-4 md:left-6 lg:left-8 text-sm sm:text-lg font-bold truncate flex-shrink-0 min-w-fit">
                    {title}
                </h1>
            )}

            {/* Center: Search Bar (if enabled) */}
            {showSearch && (
                <div className="hidden sm:flex flex-1 justify-center px-4 max-w-4xl">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
                        <Input
                            placeholder="Tìm kiếm..."
                            className="w-full pl-9 pr-4 py-2 text-sm bg-secondary/30 border-border/30 rounded-full focus:bg-secondary/50 focus:border-green-500/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Right: Actions */}
            {showActions && (
                <div className="absolute right-3 sm:right-4 md:right-6 lg:right-8 flex items-center gap-3 sm:gap-4 md:gap-5">
                    {/* Create Post Button */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        className="rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md h-9 w-9 sm:h-10 sm:w-10"
                                        onClick={handleOpenPost}
                                    >
                                        <Edit className="size-3.5 sm:size-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Tạo bài viết</p>
                                </TooltipContent>
                            </Tooltip>
                        </DialogTrigger>
                        <CreatePost onOpen={open} onClose={handleClosePost} />
                    </Dialog>

                    {/* Notification */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <Notification />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Thông báo</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* User Avatar Menu - Full menu with settings */}
                    <MenuSettings
                        onLogout={handleSignOut}
                        user={user}
                        themeMode={themeMode}
                        setTheme={setTheme}
                    />
                </div>
            )}
        </div>
    );
};

export default PageHeader;
