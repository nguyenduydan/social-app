import { useState } from "react";
import { Edit } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import logo from "@/assets/logo/logo.png";
import { useAuthStore } from "@/store/useAuthStore";
import routes from "@/routes";
import NavLink from "./NavLink";
import CreatePost from "@/components/Posts/CreatePost";
import { useLocation } from "react-router";

const DesktopNav = () => {
    const { signOut, user } = useAuthStore();
    const { pathname } = useLocation();
    const [open, setOpen] = useState(false);

    const handleSignOut = () => signOut();
    const handleOpenPost = () => setOpen(true);

    return (
        <nav className="w-full h-full bg-background/95 backdrop-blur-md flex flex-col">
            {/* BRAND SECTION - Top */}
            <div className="px-6 py-6 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="h-10 w-10 rounded-lg" />
                    <div>
                        <p className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                            DIFA
                        </p>
                        <p className="text-xs text-foreground/50">Social Hub</p>
                    </div>
                </div>
            </div>

            {/* PRIMARY NAVIGATION - Middle (Scrollable) */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-6 space-y-2 relative">
                {routes.map((item, idx) => {
                    const path =
                        item.path === "/profile"
                            ? user?.username
                                ? `/profile/${user.username}`
                                : "/profile"
                            : item.path;

                    const isActive = pathname === path;

                    return (
                        <div key={idx} className="relative">
                            {isActive && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg"
                                    transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
                                />
                            )}
                            <NavLink item={{ ...item, path }} isSidebar isActive={isActive} />
                        </div>
                    );
                })}
            </div>

            {/* USER QUICK INFO - Bottom */}
            <div className="px-4 py-6 space-y-4 border-t border-border/30 flex-shrink-0">
                {/* Create Post Button */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-300 shadow-lg"
                            onClick={handleOpenPost}
                        >
                            <Edit className="size-4 mr-2" />
                            Tạo bài viết
                        </Button>
                    </DialogTrigger>
                    <CreatePost onOpen={open} onClose={() => setOpen(false)} />
                </Dialog>

                {/* User Info Card - No settings menu */}
                <div className="bg-card/50 border border-border/30 rounded-lg p-3 flex items-center gap-2 min-w-0">
                    <Avatar className="size-8 flex-shrink-0">
                        <AvatarImage
                            src={user?.avatar?.url}
                            alt={user?.displayName}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-xs font-bold">
                            {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">
                            {user?.displayName || "User"}
                        </p>
                        <p className="text-xs text-foreground/50 truncate">
                            @{user?.username || "user"}
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default DesktopNav;
