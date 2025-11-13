import {
    Settings,
    SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "../ui/input-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import useConversationStore from "@/store/useConversationStore";

const SidebarHeader = ({ onChangeTab }) => {
    const [open, setOpen] = useState(false);
    const { searchQuery, setSearchQuery } = useConversationStore();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="flex items-center justify-between px-3 py-2 border-b border-muted gap-2">
            {/* Search */}
            <div className="flex w-full items-center gap-3">
                <div className="relative hidden w-full sm:block">
                    <InputGroup className="w-full">
                        <InputGroupInput
                            placeholder="Tìm kiếm..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>

            {/* Settings */}
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className={`rounded-full py-5 transition-transform duration-300 focus:outline-none border-none ${open ? "rotate-90" : "rotate-0"
                            }`}
                    >
                        <Settings className="size-5 text-muted-foreground" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-52 bg-background border-zinc-800 py-2 px-2 transition-transform duration-200 animate-fadeIn"
                >
                    <DropdownMenuLabel className="text-xs uppercase tracking-wide">
                        Cài đặt
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem onClick={() => onChangeTab("theme")}>
                        Giao diện
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeTab("notification")}>
                        Cài đặt thông báo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeTab("message")}>
                        Cài đặt tin nhắn
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default SidebarHeader;
