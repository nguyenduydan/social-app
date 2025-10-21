import logo from "@/assets/logo.png";
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Bell, LogOutIcon, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import Switch from '../ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router";
import { Kbd } from "../ui/kbd";

const Navbar = () => {
    const navigate = useNavigate();
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
                    <a
                        href="#"
                        className="flex items-center space-x-1 dark:brightness-200"
                    >
                        <img src={logo} className="h-6 w-6 md:h-10 md:w-10" alt="Social Logo" />
                        <span className="text-2xl md:text-4xl font-extrabold bg-gradient-to-b from-green-500 to-green-950 bg-clip-text text-transparent">
                            IFA
                        </span>
                    </a>
                </div>
                {/* Search input */}
                <div
                    id="navbar-sticky"
                    className="w-full transition-all order-2 hidden md:flex justify-center"
                >
                    <div className="w-full max-w-xl">
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
                    <Bell className="text-primary fill-primary brightness-125 size-4 md:size-6" />
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
