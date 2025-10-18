import logo from "@/assets/logo.png";
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Bell, LogOutIcon, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Switch from '../ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";

const Navbar = () => {
    const [isScrolling, setIsScrolling] = useState(false);
    const { logout } = useAuthStore();

    useEffect(() => {
        let scrollTimeout;

        const handleScroll = () => {
            setIsScrolling(true);

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);


    return (
        <nav className={`fixed bg-navbar/80 backdrop-blur-sm w-full z-50 start-0 transition-all border-b-2 ${isScrolling ? "-top-20" : "top-0"} duration-500`}>
            <div className="flex flex-wrap items-center justify-between p-4">
                <a href="#" className="flex items-center space-x-3">
                    <img src={logo} className="h-10 w-10" alt="Social Logo" />
                    <span className="self-center text-4xl whitespace-nowrap dark:brightness-150 font-extrabold text-shadow-lg bg-gradient-to-r from-emerald-700 to-green-900 bg-clip-text text-transparent">DIFA</span>
                </a>
                <div className="items-center justify-between hidden w-full pl-10 md:flex md:w-auto md:order-1 transition-all" id="navbar-sticky">
                    {/* Search input */}
                    <InputGroup className="rounded-full w-full md:min-w-2xl shadow-md bg-white">
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <div className="flex md:order-2 space-x-3 md:space-x-8 items-center">
                    <Bell />
                    <Switch />
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="translate-x-[-20px]">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><User />Profile</DropdownMenuItem>
                            <DropdownMenuItem onClick={logout}>
                                <LogOutIcon />Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
