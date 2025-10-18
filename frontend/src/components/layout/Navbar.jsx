import logo from "@/assets/logo.png";
import { Input } from '../ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Search } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '../ui/button';
import Switch from '../ui/switch';

const Navbar = () => {
    const { logout } = useAuthStore();

    return (
        <nav className="fixed bg-navbar w-full z-50 top-0 start-0 transition-all border-b-2">
            <div className="flex flex-wrap items-center justify-between p-4">
                <a href="#" className="flex items-center space-x-3">
                    <img src={logo} className="h-10 w-10" alt="Social Logo" />
                    <span className="self-center text-4xl whitespace-nowrap dark:brightness-150 font-extrabold text-shadow-lg bg-gradient-to-r from-emerald-700 to-green-900 bg-clip-text text-transparent">DIFA</span>
                </a>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 transition-all" id="navbar-sticky">
                    {/* Search input */}
                    <InputGroup className="rounded-full min-w-[500px] shadow-md">
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <div className="flex md:order-2 space-x-3 md:space-x-0 gap-2">
                    <Switch />
                    <Button onClick={logout} className="bg-primary cursor-pointer">Logout</Button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
