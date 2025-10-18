import React from "react";
import { Link, useLocation } from "react-router";

const NavLink = ({ item }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;

    return (
        <Link
            to={item.path}
            className={`relative font-semibold transition-all duration-500 ease-out text-white dark:text-white text-md p-3 rounded-2xl hover:bg-gray-400 cursor-pointer
        ${isActive ? "bg-green-800 dark:bg-green-700 text-white" : ""}
      `}
        >
            {item.icon}
        </Link>
    );
};

export default NavLink;
