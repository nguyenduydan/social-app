import React from 'react';
import logo from "@/assets/logo.png";
import { Input } from '../ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Search } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-50 top-0 start-0 border-b border-gray-200 dark:border-gray-600 transition-all">
            <div className="flex flex-wrap items-center justify-between p-4">
                <a href="#" className="flex items-center space-x-3">
                    <img src={logo} className="h-10 w-10" alt="Social Logo" />
                    <span className="self-center text-4xl whitespace-nowrap dark:text-white font-extrabold text-shadow-lg bg-gradient-to-r from-emerald-700 to-green-900 bg-clip-text text-transparent">DIFA</span>
                </a>
                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 " id="navbar-sticky">
                    {/* Search input */}
                    <InputGroup className="rounded-full min-w-[500px] shadow-md">
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
                <div className="flex md:order-2 space-x-3 md:space-x-0">
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Logout</button>
                    <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;
