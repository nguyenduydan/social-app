import React from "react";
import { Link, useLocation } from "react-router";

const NavLink = ({ item }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;

    return (
        <Link
            to={item.path}
            className={`relative flex w-15 h-10 md:w-25 md:h-12 my-1 justify-center items-center border-y-0 transition-all duration-500 ease-out rounded-full cursor-pointer
        ${isActive ? "border-x-1 border-white bg-secondary/20 dark:bg-secondary/40 shadow-[0_0_5px_rgba(0,0,0,0.6)] scale-115 text-green-900 dark:text-green-500" : "hover:border-white  hover:bg-muted/30 hover:scale-110 hover:text-green-800 dark:hover:text-green-400"}
      `}
        >
            {item.icon}
        </Link>
    );
};

export default NavLink;
