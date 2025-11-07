import React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    LogOut,
    Monitor,
    Moon,
    Settings,
    Sun,
    SunMoon,
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MenuSettings = ({ onLogout, themeMode, setTheme, user }) => {
    return (
        <DropdownMenu>
            {/* Trigger button */}
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative flex w-10 h-10 justify-center items-center rounded-full transition-transform duration-300 ease-out
                    text-foreground/60 dark:text-foreground/70 hover:text-foreground
                    hover:bg-secondary/40 dark:hover:bg-muted/50 hover:scale-110 active:scale-95"
                >
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="flex items-center justify-center w-full h-full">
                                <Avatar className="size-10 ring-offset-4 ring-offset-secondary transition-all duration-300 hover:ring-primary/40 hover:scale-105">
                                    <AvatarImage
                                        src={user?.avatar?.url}
                                        alt={user?.displayName || "User avatar"}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-xl bg-gradient-chat text-muted">
                                        {user?.displayName?.charAt(0) || "?"}
                                    </AvatarFallback>
                                </Avatar>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Tùy chọn</p>
                        </TooltipContent>
                    </Tooltip>
                </Button>
            </DropdownMenuTrigger>

            {/* Dropdown menu content */}
            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 p-2 rounded-xl bg-background/90 backdrop-blur-lg border border-border/30 transition-transform duration-200 animate-fadeIn"
            >
                <DropdownMenuLabel className="text-xs text-foreground/70 uppercase tracking-wide">
                    Tùy chọn
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="transition-all duration-200 hover:pl-3 hover:text-foreground">
                    <Settings className="size-4" />
                    <span>Cài đặt</span>
                </DropdownMenuItem>

                {/* Accordion thay submenu */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="theme">
                        <AccordionTrigger className="flex items-center px-2 py-2 hover:pl-3 cursor-pointer !no-underline hover:!no-underline justify-between hover:bg-accent transition-all">
                            <div className="flex items-center">
                                <SunMoon className="size-4 mr-2" />
                                <span className="font-normal">Chế độ hiển thị</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-3 pt-1 pb-2 space-y-1">
                            <button
                                onClick={() => setTheme("light")}
                                className={cn(
                                    "flex items-center w-full rounded-md px-4 py-1.5 text-sm text-left transition-all hover:bg-accent/40",
                                    themeMode === "light" && " bg-accent/30"
                                )}
                            >
                                <Sun className="size-4 mr-2" />
                                Sáng
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={cn(
                                    "flex items-center w-full rounded-md px-4 py-1.5 text-sm text-left transition-all hover: hover:bg-accent/40",
                                    themeMode === "dark" && " bg-accent/30"
                                )}
                            >
                                <Moon className="size-4 mr-2" />
                                Tối
                            </button>
                            <button
                                onClick={() => setTheme("system")}
                                className={cn(
                                    "flex items-center w-full rounded-md px-4 py-1.5 text-sm text-left transition-all hover: hover:bg-accent/40",
                                    themeMode === "system" && " bg-accent/30"
                                )}
                            >
                                <Monitor className="size-4 mr-2" />
                                Hệ thống
                            </button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={onLogout}
                    className="text-destructive font-bold cursor-pointer transition-all duration-200 hover:pl-3"
                >
                    <LogOut className="size-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MenuSettings;
