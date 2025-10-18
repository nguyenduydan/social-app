import React from "react";

const NavLink = ({ item, isActive, onNavigate }) => {
    return (
        <a
            key={item.href}
            href={item.href}
            onClick={() => onNavigate(item.href)}
            className={` relative font-semibold transition-all duration-500 ease-out text-black dark:text-white text-md p-3 rounded-2xl hover:bg-gray-400
                ${isActive ? "bg-green-800 text-white" : ""} cursor-pointer
            `}
        >
            {item.icon}
        </a>
    );
};

export default NavLink;
