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

const SidebarHeader = ({ onChangeTab }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex items-center justify-between px-3 py-2 border-b border-muted gap-2">
            {/* Search */}
            <div className="flex w-full items-center gap-3">
                <div className="relative hidden w-full sm:block">
                    <InputGroup className="w-full">
                        <InputGroupInput placeholder="Tìm kiếm..." />
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
                    className="w-52 bg-background border-zinc-800 py-2 px-2"
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
