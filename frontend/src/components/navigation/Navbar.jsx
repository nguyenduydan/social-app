import logo from "@/assets/logo.png";
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Bell, Edit, LogOutIcon, Plus, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Switch from '../ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link, useNavigate } from "react-router";
import { Kbd } from "../ui/kbd";
import { Button } from "../ui/button";
import { useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import CreatePost from "../Posts/CreatePost";
import { DialogTrigger } from "../ui/dialog";

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const { signOut, user } = useAuthStore();


    const handleLogOut = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className="fixed bg-card w-full px-6 py-4 z-50 start-0 transition-all duration-300 border-b border-border/20">
            <div className="flex items-center justify-between gap-10">
                {/* Brand */}
                <div className="flex-shrink-0">
                    <div className="flex items-center space-x-1 dark:brightness-200 cursor-default ">
                        <img src={logo} className="h-6 w-6 md:h-10 md:w-10" alt="Social Logo" />
                        <span className="text-2xl md:text-4xl font-extrabold bg-gradient-to-b from-green-500 to-green-950 bg-clip-text text-transparent">
                            IFA
                        </span>
                    </div>
                </div>
                {/* Search input */}
                <div
                    id="navbar-sticky"
                    className="w-full transition-all order-2 hidden md:flex justify-center"
                >
                    <div className="w-full md:w-md lg:max-w-xl">
                        <InputGroup className="rounded-full shadow-md bg-white dark:bg-black/50 px-2">
                            <InputGroupInput
                                placeholder="Search..."
                                className="text-sm md:text-base bg-transparent focus:outline-none"
                            />
                            <InputGroupAddon>
                                <Search className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end">
                                <Kbd>Ctrl + K</Kbd>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>

                {/* Menubar */}
                <div className="flex md:order-3 space-x-5 md:space-x-8 items-center">
                    {/* Add Post Button on mobile- tablet */}
                    <Dialog
                        open={open}
                        onOpenChange={(isOpen) => {
                            setOpen(isOpen);
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2 bg-gradient-primary text-white py-2 px-4 rounded-2xl font-semibold text-md        hover:scale-[1.03] hover:brightness-110 active:scale-[0.98] transition-all duration-300 ease-in-out shadow-md hover:shadow-lg lg:hidden"
                                onClick={() => setOpen(true)}
                            >
                                <Edit className="w-4 h-4 md:w-5 md:h-5" />
                                <span className="hidden sm:block">Tạo bài viết</span>
                            </Button>
                        </DialogTrigger>
                        <CreatePost onOpen={open} onClose={() => setOpen(false)} />
                    </Dialog>

                    <Bell className="text-primary fill-primary brightness-125 size-4 md:size-6" />
                    {/* Dark Mode Switch */}
                    <Switch />
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger className="cursor-pointer" asChild>
                            <Avatar className="size-8 md:size-10">
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="translate-x-[-20px]">
                            <DropdownMenuLabel>{user?.displayName}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><User />Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogOut}>
                                <LogOutIcon />Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
