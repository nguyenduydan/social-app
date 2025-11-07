import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import SidebarHeader from "./SidebarHeader";
import UserList from "./UserList";
import GroupList from "./GroupList";
import ColorTheme from "./ColorTheme";
import SettingNotification from "./SettingNotification";
import SettingMessage from "./SettingMessage";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

const Sidebar = ({ className = "" }) => {
    const [activeTab, setActiveTab] = React.useState("users");
    const [direction, setDirection] = React.useState(0);

    const isMainTab = activeTab === "users" || activeTab === "groups";

    const handleTabChange = (nextTab) => {
        if (activeTab === nextTab) return;
        // direction chỉ để xác định hướng trượt (ko ảnh hưởng đến tab)
        setDirection(1);
        setActiveTab(nextTab);
    };

    const handleGoBack = () => {
        setDirection(-1);
        setActiveTab("users");
    };

    const renderContent = () => {
        switch (activeTab) {
            case "users":
                return <UserList />;
            case "groups":
                return <GroupList />;
            case "theme":
                return <ColorTheme />;
            case "notification":
                return <SettingNotification />;
            case "message":
                return <SettingMessage />;
            default:
                return null;
        }
    };

    const renderHeaderTitle = () => {
        switch (activeTab) {
            case "theme":
                return "Giao diện";
            case "notification":
                return "Cài đặt thông báo";
            case "message":
                return "Cài đặt tin nhắn";
            default:
                return null;
        }
    };

    return (
        <aside className={`flex flex-col bg-card ${className}`}>
            {/* Header (animate riêng) */}
            <div className="relative h-[56px] border-b border-border overflow-hidden">
                <AnimatePresence mode="popLayout" custom={direction}>
                    {isMainTab ? (
                        <motion.div
                            key="main-header"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute inset-0"
                        >
                            <SidebarHeader onChangeTab={handleTabChange} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sub-header"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-between px-3"
                        >
                            <Button
                                variant="ghost"
                                onClick={handleGoBack}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition cursor-pointer"
                            >
                                <ArrowLeft />
                            </Button>
                            <span className="text-sm font-semibold">{renderHeaderTitle()}</span>
                            <div className="w-10" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tabs section (không slide, cố định) */}
            {isMainTab && (
                <div className="border-b border-border bg-card px-3 py-2">
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="grid grid-cols-2 w-full bg-muted/30 rounded-md">
                            <TabsTrigger
                                value="users"
                                className="text-sm data-[state=active]:text-accent data-[state=active]:font-medium"
                            >
                                Bạn bè
                            </TabsTrigger>
                            <TabsTrigger
                                value="groups"
                                className="text-sm data-[state=active]:text-accent data-[state=active]:font-medium"
                            >
                                Nhóm
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            )}

            {/* Animated content */}
            <div className="relative flex-1 overflow-hidden">
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={activeTab}
                        custom={direction}
                        initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
                        transition={{
                            duration: 0.25,
                            ease: [0.25, 0.8, 0.5, 1],
                        }}
                        className="absolute inset-0 h-full w-full"
                    >
                        <ScrollArea className="h-full p-3">
                            {renderContent()}
                        </ScrollArea>
                    </motion.div>
                </AnimatePresence>
            </div>
        </aside>
    );
};

export default Sidebar;
