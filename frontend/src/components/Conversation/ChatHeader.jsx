import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { FieldDescription } from "@/components/ui/field";
import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { motion, AnimatePresence } from "framer-motion";

const ChatHeader = () => {
    const [isSearch, setIsSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                !searchValue
            ) {
                setIsSearch(false);
            }
        };
        if (isSearch) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearch, searchValue]);

    const handleOpenSearch = () => setIsSearch(true);
    const handleCloseSearch = () => {
        setIsSearch(false);
        setSearchValue("");
    };

    return (
        <div className="flex px-8 py-3 justify-between items-center relative overflow-hidden">
            {/* Avatar + Name */}
            <motion.div
                initial={{ opacity: 1, x: 0 }}
                animate={
                    isSearch
                        ? { opacity: 0, x: -20, width: 0 }
                        : { opacity: 1, x: 0, width: "auto" }
                }
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex gap-5 items-center overflow-hidden"
            >
                <Avatar className="h-10 w-10 md:h-12 md:w-12 ring-offset-4 ring-offset-background transition-all duration-300 hover:ring-primary/40 hover:scale-105">
                    <AvatarImage src="/dsds" alt={"User avatar"} className="object-cover" />
                    <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {"?"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                    <Label className="text-lg">DisplayName</Label>
                    <FieldDescription>Time activity</FieldDescription>
                </div>
            </motion.div>

            {/* Actions */}
            <div
                className={cn(
                    "flex items-center gap-3 transition-all duration-300 ease-in-out",
                    isSearch ? "flex-1" : "ml-auto"
                )}
            >
                <div
                    ref={searchRef}
                    className="flex items-center justify-end relative w-full "
                >
                    <AnimatePresence>
                        {isSearch && (
                            <motion.div
                                key="searchbar"
                                initial={{ width: 0, opacity: 0, x: 40 }}
                                animate={{ width: "100%", opacity: 1, x: 0 }}
                                exit={{ width: 0, opacity: 0, x: 40 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                                className="flex items-center"
                            >
                                <InputGroup className="h-10 shadow-lg bg-card dark:bg-card w-full ">
                                    <InputGroupInput
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        placeholder="Tìm kiếm..."
                                        autoFocus
                                        className="animate-in fade-in duration-300"
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton
                                            size="icon"
                                            onClick={handleCloseSearch}
                                            className="hover:bg-destructive/10 w-5 h-6"
                                        >
                                            <X className="size-4 text-destructive" />
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nút Search */}
                <AnimatePresence>
                    {!isSearch && (
                        <motion.div
                            key="search-icon"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="group transition-all duration-300"
                                onClick={handleOpenSearch}
                            >
                                <Search className="size-6 group-hover:scale-110 transition-transform" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <EllipsisVertical className="size-6" />
                        </Button>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default ChatHeader;
