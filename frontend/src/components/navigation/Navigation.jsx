import NavLink from "./NavLink";
import routes from "@/routes";
import { useScrollStatus } from "@/hooks/useScrollStatus";
import { useScrollRef } from "@/contexts/ScrollContext";
import Switch from "../ui/switch";
import { Bell, Edit, Edit2, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { Dialog, DialogTrigger } from "../ui/dialog";
import CreatePost from "../Posts/CreatePost";

const Navigation = () => {
    const scrollRef = useScrollRef();
    const { signOut } = useAuthStore();
    const { isScrolling, scrollY } = useScrollStatus(scrollRef, 5, 400);
    const [open, setOpen] = useState(false);

    return (
        <nav
            className={`fixed w-full z-20 bottom-2 transition-all duration-300 ease-out ${isScrolling ? "scale-50 translate-y-20" : "scale-100 translate-y-0"
                }`}
        >
            <div className="flex justify-center mx-auto z-10 px-5">
                <div
                    className="
                    bg-secondary/30 dark:bg-neutral-900/40
                    backdrop-blur
                    shadow-[0_0_5px] shadow-black/20 dark:shadow-white/10
                    rounded-full
                    px-4 md:px-6 py-2
                    inline-flex items-center
                    max-w-full
                    overflow-x-auto scrollbar-none
                    transition-all duration-300 ease-out
                ">
                    <div className="flex items-center gap-3 md:gap-5 flex-nowrap">
                        {/* Logo */}
                        <div>

                        </div>
                        <div className="flex-shrink-0">
                            <div className="flex items-center space-x-1 dark:brightness-200 cursor-default">
                                <img src={logo} className="h-6 w-6 md:h-8 md:w-8" alt="Social Logo" />
                                <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-b from-green-500 to-green-950 bg-clip-text text-transparent">
                                    IFA
                                </span>
                            </div>
                        </div>

                        <div className="border-1 h-8 md:h-10" />

                        {/* Routes */}
                        {routes.map((item, idx) => (
                            <NavLink key={idx} item={item} />
                        ))}

                        <div className="border-1 h-8 md:h-10" />

                        {/* Right nav */}
                        <div className="flex items-center gap-2 md:gap-4 px-1 md:px-2 flex-shrink-0">
                            {/* Create post */}
                            {scrollY > 200 && (
                                <Dialog
                                    open={open}
                                    onOpenChange={(isOpen) => {
                                        setOpen(isOpen);
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            onClick={() => setOpen(true)}
                                            variant="ghost"
                                            className="relative flex w-8 h-8 md:h-12 md:w-12 justify-center items-center rounded-full transition-all duration-300 ease-out text-foreground/50 dark:text-foreground/80 hover:text-foreground hover:bg-secondary/30 dark:hover:bg-muted/60 hover:shadow-[0_0_5px_0px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-90 cursor-pointer">
                                            <Edit className="size-4 md:size-6 " />
                                        </Button>
                                    </DialogTrigger>
                                    <CreatePost onOpen={open} onClose={() => setOpen(false)} />
                                </Dialog>
                            )}
                            {/* Thông báo */}
                            <div className="relative flex w-8 h-8 md:h-12 md:w-12 justify-center items-center rounded-full transition-all duration-300 ease-out text-foreground/50 dark:text-foreground/80 hover:text-foreground hover:bg-secondary/30 dark:hover:bg-muted/60 hover:shadow-[0_0_5px_0px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-90 cursor-pointer">
                                <Bell className="size-4 md:size-6 " />
                            </div>

                            <Switch />

                            <Button
                                onClick={signOut}
                                variant="ghost"
                                className="relative flex w-8 h-8 md:h-12 md:w-12 justify-center items-center rounded-full transition-all duration-300 ease-out text-foreground/50 dark:text-foreground/80 hover:text-foreground hover:bg-secondary/30 dark:hover:bg-muted/60 hover:shadow-[0_0_5px_0px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-90 cursor-pointer"
                            >
                                <LogOut className="size-4 md:size-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
