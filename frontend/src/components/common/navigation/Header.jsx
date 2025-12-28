import { useState } from "react";
import { Bell, Edit, Search } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo/logo.png";
import { useAuthStore } from "@/store/useAuthStore";
import CreatePost from "@/components/Posts/CreatePost";
import Notification from "../notifications/Notification";
import MenuSettings from "./MenuSettings";

const Header = () => {
    const { user, signOut } = useAuthStore();
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSignOut = () => signOut();
    const handleOpenPost = () => setOpen(true);
    const handleClosePost = () => setOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-b border-border/50 z-[98] md:pl-0 lg:pl-72 transition-all duration-300">
            <div className="h-full px-4 md:px-6 lg:px-8 flex items-center justify-between gap-4">
                {/* Left: App Name (Mobile only) */}
                <div className="md:hidden flex items-center gap-2 min-w-fit">
                    <img src={logo} alt="Logo" className="h-8 w-8 rounded-lg" />
                    <span className="text-lg font-bold text-green-500">DIFA</span>
                </div>

                {/* Center: Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
                        <Input
                            placeholder="Tìm kiếm..."
                            className="pl-9 pr-4 py-2 bg-secondary/30 border-border/30 rounded-full text-sm focus:bg-secondary/50 focus:border-green-500/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 ml-auto">
                    {/* Create Post Button */}
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon"
                                        className="rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                        onClick={handleOpenPost}
                                    >
                                        <Edit className="size-4" />
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
                            <div className="relative">
                                <Notification />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Thông báo</p>
                        </TooltipContent>
                    </Tooltip>

                    {/* User Avatar Menu */}
                    <div className="pl-2 border-l border-border/30">
                        <MenuSettings onLogout={handleSignOut} user={user} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
