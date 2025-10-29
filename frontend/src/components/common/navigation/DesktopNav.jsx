import { useState, cloneElement } from "react";
import { Bell, Edit, LogOut, X } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo/logo.png";
import { useAuthStore } from "@/store/useAuthStore";
import routes from "@/routes";
import NavLink from "./NavLink";
import CreatePost from "@/components/Posts/CreatePost";
import { useScrollStatus } from "@/hooks/useScrollStatus";
import { useScrollRef } from "@/contexts/ScrollContext";
import Switch from "@/components/ui/switch";

const DesktopNav = () => {
    const scrollRef = useScrollRef();
    const { isAtTop } = useScrollStatus(scrollRef, 5, 400);
    const { signOut, user } = useAuthStore();
    const [open, setOpen] = useState(false);

    return (
        <nav
            className={cn(
                isAtTop ? "inline-block bg-background" : "fixed top-2",
                "w-full z-20 transition-all duration-300 ease-out"
            )}
        >
            <div
                className={cn(
                    "flex justify-center mx-auto z-10 py-1 shadow-md bg-secondary/30 dark:bg-neutral-900/40 backdrop-blur transition-all duration-300 ease-out",
                    isAtTop
                        ? "w-full max-w-full rounded-none px-20"
                        : "max-w-4xl w-full rounded-full px-10"
                )}
            >
                <div className="flex items-center justify-between w-full">
                    {/* Logo */}
                    <div className="flex items-center space-x-1 mr-5 cursor-default flex-1">
                        <img
                            src={logo}
                            className="h-8 w-8 md:h-10 md:w-10"
                            alt="Social Logo"
                        />
                        <span className="text-3xl dark:brightness-200 font-extrabold bg-gradient-to-b from-green-500 to-green-950 bg-clip-text text-transparent">
                            DIFA
                        </span>
                    </div>

                    {/* Routes — luôn nằm giữa */}
                    <div className="flex justify-center flex-1 border-x-1 px-10 border-muted">
                        <div className="flex gap-10">
                            {routes.map((item, idx) => {
                                const path =
                                    item.path === "/profile"
                                        ? user?.username
                                            ? `/profile/${user.username}`
                                            : "/profile" // fallback khi chưa có username
                                        : item.path;

                                return (
                                    <Tooltip key={idx}>
                                        <TooltipTrigger>
                                            <NavLink item={{ ...item, path }} isAtTop={isAtTop} />
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
                    <div className="flex items-center gap-5 justify-end flex-1">
                        {!isAtTop && (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <IconButton
                                        icon={<Edit />}
                                        label="Tạo bài viết"
                                        onClick={() => setOpen(true)}
                                    />
                                </DialogTrigger>
                                <CreatePost onOpen={open} onClose={() => setOpen(false)} />
                            </Dialog>
                        )}
                        <IconButton icon={<Bell />} label="Thông báo" />
                        <Switch />
                        <IconButton icon={<LogOut />} label="Đăng xuất" onClick={signOut} />
                    </div>
                </div>

            </div>
        </nav>
    );
};

// Reusable Icon Button
const IconButton = ({ icon, label, onClick }) => {
    const sizedIcon = cloneElement(icon, {
        className: cn(icon.props.className, "size-5 md:size-6"),
    });

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={onClick}
                    className="relative flex w-10 h-10 justify-center items-center rounded-full transition-all duration-300 ease-out text-foreground/50 dark:text-foreground/80 hover:text-foreground hover:bg-secondary/40 dark:hover:bg-muted/50 hover:scale-105 active:scale-90"
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
