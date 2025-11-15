import { useState, cloneElement } from "react";
import { Bell, Edit } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo/logo.png";
import { useAuthStore } from "@/store/useAuthStore";
import routes from "@/routes";
import NavLink from "./NavLink";
import CreatePost from "@/components/Posts/CreatePost";
import { useScrollRef } from "@/contexts/ScrollContext";
import { useScrollStatus } from "@/hooks/useScrollStatus";
import { useThemeStore } from "@/store/useThemeStore";
import MenuSettings from "./MenuSettings";
import Notification from "../notifications/Notification";
import { motion, AnimatePresence } from "framer-motion";

const DesktopNav = () => {
    const scrollRef = useScrollRef();
    const { isAtTop } = useScrollStatus(scrollRef, 5, 300);
    const { signOut, user } = useAuthStore();
    const [open, setOpen] = useState(false);
    const { themeMode, setTheme } = useThemeStore();

    const handleSignOut = () => signOut();
    const handleOpenPost = () => setOpen(true);
    const handleClosePost = () => setOpen(false);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-[99] transition-all duration-500 ease-out will-change-transform",
                isAtTop
                    ? "bg-background/95 backdrop-blur-md shadow-sm"
                    : "bg-background/50 dark:bg-neutral-900/30 backdrop-blur-xl shadow-lg"
            )}
        >
            <div
                className={cn(
                    "flex justify-center mx-auto py-2 px-6 md:px-10 lg:px-20 transition-all duration-300 ease-out",
                )}
            >
                <div className="flex items-center justify-between w-full">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 cursor-default flex-1">
                        <img
                            src={logo}
                            className={cn(
                                "transition-all duration-500 h-10 w-10",
                            )}
                            alt="Social Logo"
                        />
                        <span className="text-3xl dark:brightness-200 font-extrabold bg-gradient-to-b from-green-500 to-green-950 bg-clip-text text-transparent select-none">
                            DIFA
                        </span>
                    </div>

                    {/* Routes */}
                    <div className="flex justify-center flex-1 border-x px-10 border-muted transition-all duration-500">
                        <div className="flex gap-10">
                            {routes.map((item, idx) => {
                                const path =
                                    item.path === "/profile"
                                        ? user?.username
                                            ? `/profile/${user.username}`
                                            : "/profile"
                                        : item.path;

                                return (
                                    <Tooltip key={idx}>
                                        <TooltipTrigger>
                                            <div className="transition-transform duration-300 hover:scale-110 hover:brightness-125">
                                                <NavLink item={{ ...item, path }} />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-10 justify-end flex-1">
                        {/* Create Post */}
                        {!isAtTop && (
                            <AnimatePresence>
                                <motion.div
                                    key="create-post-button"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5, ease: "easeInOut" }}
                                >
                                    <Dialog open={open} onOpenChange={setOpen}>
                                        <DialogTrigger asChild>
                                            <AnimatedIcon
                                                icon={<Edit />}
                                                label="Tạo bài viết"
                                                onClick={handleOpenPost}
                                            />
                                        </DialogTrigger>
                                        <CreatePost onOpen={open} onClose={handleClosePost} />
                                    </Dialog>
                                </motion.div>
                            </AnimatePresence>
                        )}

                        {/* Notification */}
                        <Notification />

                        {/* Dropdown menu */}
                        <MenuSettings onLogout={handleSignOut} themeMode={themeMode} setTheme={setTheme} user={user} />
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Animated Icon
const AnimatedIcon = ({ icon, label, onClick }) => {
    const sizedIcon = cloneElement(icon, {
        className: cn(icon.props.className, "size-5 md:size-6"),
    });

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={onClick}
                    className="relative flex w-10 h-10 justify-center items-center rounded-full transition-transform duration-300 ease-out
                     text-foreground/60 dark:text-foreground/70 hover:text-foreground
                     hover:bg-secondary/40 dark:hover:bg-muted/50 hover:scale-110
                     active:scale-95"
                >
                    {sizedIcon}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
};

export default DesktopNav;
