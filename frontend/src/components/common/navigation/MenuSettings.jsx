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

const MenuSettings = ({ onLogout, themeMode, setTheme, user, isSidebar }) => {
    return (
        <DropdownMenu>
            {/* Trigger button */}
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "transition-transform duration-300 ease-out text-foreground/60 dark:text-foreground/70 hover:text-foreground hover:bg-secondary/40 dark:hover:bg-muted/50 hover:scale-110 active:scale-95",
                        isSidebar
                            ? "w-full px-4 py-3 justify-start items-center gap-3 rounded-lg"
                            : "relative flex w-10 h-10 justify-center items-center rounded-full"
                    )}
                >
                    {isSidebar ? (
                        <>
                            <Settings className="size-5 flex-shrink-0" />
                            <span className="font-medium">Tùy chọn</span>
                        </>
                    ) : (
                        <Avatar className="size-8 ring-offset-2 ring-offset-background transition-all duration-300 hover:ring-green-500/40 hover:scale-105 cursor-pointer">
                            <AvatarImage
                                src={user?.avatar?.url}
                                alt={user?.displayName || "User avatar"}
                                className="object-cover"
                            />
                            <AvatarFallback className="text-sm bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold">
                                {user?.displayName?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    )}
                </Button>
            </DropdownMenuTrigger>

            {/* Dropdown menu content */}
            <DropdownMenuContent
                align={isSidebar ? "start" : "end"}
                sideOffset={8}
                className="w-56 p-2 rounded-xl bg-background/90 backdrop-blur-lg border border-border/30 transition-transform duration-200 animate-fadeIn"
            >
                <DropdownMenuLabel className="text-xs text-foreground/70 uppercase tracking-wide">
                    Tùy chọn
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {!isSidebar && (
                    <>
                        <DropdownMenuItem className="transition-all duration-200 hover:pl-3 hover:text-green-500 group cursor-pointer">
                            <Settings className="size-4 group-hover:text-green-500" />
                            <span>Cài đặt</span>
                        </DropdownMenuItem>
                    </>
                )}

                {/* Accordion thay submenu */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="theme">
                        <AccordionTrigger className="flex items-center px-2 py-2 hover:pl-3 cursor-pointer !no-underline hover:!no-underline justify-between hover:bg-accent hover:text-foreground transition-all">
                            <div className="flex items-center">
                                <SunMoon className="size-4 mr-2" />
                                <span className="font-normal">Chế độ hiển thị</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-3 pt-1 pb-2 space-y-1">
                            <Button
                                onClick={() => setTheme("light")}
                                variant="ghost"
                                className={cn(
                                    "justify-start w-full rounded-md px-4 py-1.5 text-sm text-left transition-all hover:bg-accent hover:text-foreground",
                                    themeMode === "light" && " bg-green-500/20 text-green-600 dark:text-green-400"
                                )}
                            >
                                <Sun className="size-4 mr-2" />
                                Sáng
                            </Button>
                            <Button
                                onClick={() => setTheme("dark")}
                                variant="ghost"
                                className={cn(
                                    "justify-start w-full rounded-md px-4 py-1.5 text-sm text-left transition-all hover:bg-accent hover:text-foreground",
                                    themeMode === "dark" && " bg-green-500/20 text-green-600 dark:text-green-400"
                                )}
                            >
                                <Moon className="size-4 mr-2" />
                                Tối
                            </Button>
                            <Button
                                onClick={() => setTheme("system")}
                                variant="ghost"
                                className={cn(
                                    "justify-start w-full rounded-md px-4 py-1.5 text-sm text-left transition-all hover:bg-accent hover:text-foreground",
                                    themeMode === "system" && " bg-green-500/20 text-green-600 dark:text-green-400"
                                )}
                            >
                                <Monitor className="size-4 mr-2" />
                                Hệ thống
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={onLogout}
                    className="text-destructive font-semibold cursor-pointer transition-all duration-200 hover:pl-3 hover:bg-destructive/10"
                >
                    <LogOut className="size-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default MenuSettings;
