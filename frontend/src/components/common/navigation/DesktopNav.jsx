import { useState, cloneElement, memo, useCallback } from "react";
import { Bell, Edit, LogOut, Settings } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo/logo.png";
import { useAuthStore } from "@/store/useAuthStore";
import routes from "@/routes";
import NavLink from "./NavLink";
import CreatePost from "@/components/Posts/CreatePost";
import { useScrollStatus } from "@/hooks/useScrollStatus";
import { useScrollRef } from "@/contexts/ScrollContext";
import Switch from "@/components/ui/switch";
import { useThemeStore } from "@/store/useThemeStore";

const DesktopNav = () => {
    const scrollRef = useScrollRef();
    const { isAtTop } = useScrollStatus(scrollRef, 5, 400);
    const { signOut, user } = useAuthStore();
    const [open, setOpen] = useState(false);
    const { theme, toggleTheme } = useThemeStore();

    const handleToggleTheme = useCallback(() => toggleTheme(), [toggleTheme]);
    const handleSignOut = useCallback(() => signOut(), [signOut]);

    return (
        <nav
            className={cn(
                isAtTop ? "inline-block bg-background" : "fixed top-2",
                "w-full z-20 transition-all duration-500 ease-out"
            )}
        >
            <div
                className={cn(
                    "flex justify-center mx-auto z-99 py-1 shadow-md bg-secondary/30 dark:bg-neutral-900/40 backdrop-blur-lg transition-all duration-200 ease-out",
                    isAtTop
                        ? "w-full max-w-full rounded-none px-20"
                        : "max-w-4xl w-full rounded-full px-10"
                )}
            >
                <div className="flex items-center justify-between w-full">
                    {/* Logo */}
                    <div className="flex items-center space-x-1 mr-5 cursor-default flex-1 transition-transform duration-300">
                        <img
                            src={logo}
                            className="h-8 w-8 md:h-10 md:w-10 animate-fadeIn"
                            alt="Social Logo"
                        />
                        <span className="text-3xl dark:brightness-200 font-extrabold bg-gradient-to-b from-green-500 to-green-950 bg-clip-text text-transparent select-none">
                            DIFA
                        </span>
                    </div>

                    {/* Routes */}
                    <div className="flex justify-center flex-1 border-x px-10 border-muted">
                        <div className="flex gap-10 animate-fadeIn">
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
                                            <div className="transition-transform duration-200 hover:scale-110 hover:brightness-125">
                                                <NavLink item={{ ...item, path }} isAtTop={isAtTop} />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="animate-fadeIn">
                                            <p>{item.name}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-5 justify-end flex-1">
                        {isAtTop ? (
                            <>
                                <AnimatedIcon icon={<Bell />} label="Thông báo" />
                                <AnimatedSwitch checked={theme === "dark"} toggle={handleToggleTheme} />
                                <AnimatedIcon icon={<LogOut />} label="Đăng xuất" onClick={handleSignOut} />
                            </>
                        ) : (
                            <>
                                {/* Create Post */}
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <AnimatedIcon
                                            icon={<Edit />}
                                            label="Tạo bài viết"
                                            onClick={() => setOpen(true)}
                                        />
                                    </DialogTrigger>
                                    <CreatePost onOpen={open} onClose={() => setOpen(false)} />
                                </Dialog>

                                {/* Darkmode */}
                                <AnimatedSwitch checked={theme === "dark"} toggle={handleToggleTheme} />

                                {/* Dropdown */}
                                <AnimatedDropdown onLogout={handleSignOut} />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

// Reusable animated icon
const AnimatedIcon = memo(({ icon, label, onClick }) => {
    const sizedIcon = cloneElement(icon, {
        className: cn(icon.props.className, "size-5 md:size-6"),
    });

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    onClick={onClick}
                    className="relative flex w-10 h-10 justify-center items-center rounded-full transition-all duration-300 ease-out
                     text-foreground/50 dark:text-foreground/80 hover:text-foreground
                     hover:bg-secondary/40 dark:hover:bg-muted/50 hover:scale-110
                     active:scale-90 hover:rotate-[10deg]"
                >
                    {sizedIcon}
                </Button>
            </TooltipTrigger>
            <TooltipContent className="animate-fadeIn">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
});

// Animated theme switch
const AnimatedSwitch = memo(({ checked, toggle }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <div
                onClick={toggle}
                className="cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-90"
            >
                <Switch checked={checked} />
            </div>
        </TooltipTrigger>
        <TooltipContent className="animate-fadeIn">
            <p>Chế độ tối</p>
        </TooltipContent>
    </Tooltip>
));

// Animated dropdown
const AnimatedDropdown = memo(({ onLogout }) => (
    <DropdownMenu>
        <Tooltip>
            <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative flex w-10 h-10 justify-center items-center rounded-full transition-all duration-300 ease-out
                       text-foreground/50 dark:text-foreground/80 hover:text-foreground
                       hover:bg-secondary/40 dark:hover:bg-muted/50 hover:scale-110
                       active:scale-90 hover:rotate-[90deg]"
                    >
                        <Settings className="size-5 md:size-6" />
                    </Button>
                </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent className="animate-fadeIn">
                <p>Cài đặt</p>
            </TooltipContent>
        </Tooltip>

        <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-48 p-2 rounded-xl bg-background/95 backdrop-blur-lg border border-border/30 animate-fadeIn"
        >
            <DropdownMenuLabel className="text-xs text-foreground/70 uppercase tracking-wide">
                Cài đặt
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="transition-all duration-200 hover:pl-3">
                <Bell className="size-4 mr-2" />
                <span>Thông báo</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                onClick={onLogout}
                className="text-red-600 dark:text-red-400 cursor-pointer transition-all duration-200 hover:pl-3"
            >
                <LogOut className="size-4 mr-2" />
                <span>Đăng xuất</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
));


export default memo(DesktopNav);
