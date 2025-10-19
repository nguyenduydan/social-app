import logo from "@/assets/logo.png";
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Bell, LogOutIcon, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Switch from '../ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";
// import { toast } from "sonner";
// import { api } from "@/lib/axios";

const Navbar = () => {
    const navigate = useNavigate();
    const [isScrolling, setIsScrolling] = useState(false);
    const { signOut, user } = useAuthStore();

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

    const handleLogOut = async () => {
        try {
            await signOut();
            navigate("/signin");
        } catch (error) {
            console.log(error);
        }
    };

    // const handleTest = async () => {
    //     try {
    //         await api.get("users/test", { withCredentials: true });
    //         toast.success("Oke");
    //     } catch (error) {
    //         console.log(error);
    //         toast.error("Lỗi");
    //     }
    // };


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
                    {/* <Button onClick={handleTest}>
                    </Button> */}
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
        </nav>
    );
};

export default Navbar;
