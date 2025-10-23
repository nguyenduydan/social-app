import NavLink from "./NavLink";
import routes from "@/routes";
import { Edit, Bell, LogOut, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from "../ui/dialog";
import CreatePost from "../Posts/CreatePost";
import { useState, cloneElement } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import Switch from "../ui/switch";
import { useThemeStore } from "@/store/useThemeStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useScrollStatus } from "@/hooks/useScrollStatus";
import { useScrollRef } from "@/contexts/ScrollContext";

const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const scrollRef = useScrollRef();
    const { isScrolling, isAtTop } = useScrollStatus(scrollRef, 5, 400);
    const { signOut } = useAuthStore();
    const { theme, toggleTheme } = useThemeStore();

    return (
        <nav
            className={`fixed bottom-0 left-0 right-0
                       bg-secondary/40 dark:bg-neutral-900/50 backdrop-blur-lg
                       border-t border-border/30 shadow-[0_-2px_5px_rgba(0,0,0,0.15)]
                       z-50 px-4 flex justify-between items-center gap-3 ${isScrolling ? "translate-y-20 scale-50" : "scale-100 translate-0"} transition-all duration-300`}
        >
            {/* Routes (các tab điều hướng chính) */}
            <div className="flex justify-evenly flex-1">
                {routes.map((item, idx) => (
                    <NavLink key={idx} item={item} />
                ))}
            </div>

            {/* Nút tạo bài viết (ở giữa hoặc cuối) */}
            {!isAtTop && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button
                            size="icon"
                            variant="default"
                            className="rounded-full size-10 shadow-md active:scale-90"
                            onClick={() => setOpen(true)}
                        >
                            <Edit className="size-5" />
                        </Button>
                    </DialogTrigger>
                    <CreatePost onOpen={open} onClose={() => setOpen(false)} />
                </Dialog>
            )}

            {/* Menu cài đặt */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-secondary/40 dark:hover:bg-muted/50 active:scale-95"
                    >
                        <Settings className="size-5" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-48 p-2 rounded-xl bg-background/95 backdrop-blur-lg border border-border/30"
                >
                    <DropdownMenuLabel className="text-xs text-foreground/70 uppercase tracking-wide">
                        Cài đặt
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Thông báo */}
                    <DropdownMenuItem asChild>
                        <IconButton icon={<Bell />} label="Thông báo" />
                    </DropdownMenuItem>

                    {/* Giao diện */}
                    <DropdownMenuItem asChild className="px-1">
                        <div
                            className="flex items-center space-x-0 gap-0 justify-start px-0 py-1.5 rounded-md hover:bg-secondary/40 dark:hover:bg-muted/40 transition-colors cursor-pointer"
                            onClick={toggleTheme}
                        >
                            <Switch checked={theme === "dark"} />
                            <span className="text-sm text-foreground/80 select-none">Chế độ tối</span>
                        </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Đăng xuất */}
                    <DropdownMenuItem asChild>
                        <IconButton
                            icon={<LogOut />}
                            label="Đăng xuất"
                            onClick={signOut}
                        />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
};

// Nút icon + label tái sử dụng cho dropdown
const IconButton = ({ icon, label, onClick }) => {
    const sizedIcon = cloneElement(icon, {
        className: cn(icon.props.className, "size-4 mr-2 shrink-0"),
    });

    return (
        <button
            onClick={onClick}
            className="flex w-full items-center rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-secondary/40 dark:hover:bg-muted/40 transition-colors"
        >
            {sizedIcon}
            <span>{label}</span>
        </button>
    );
};

export default MobileNav;
