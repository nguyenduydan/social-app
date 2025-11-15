import React, { useState, useCallback, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidebarHeader from "./SidebarHeader";
import UserList from "./UserList";
import GroupList from "./GroupList";
import UISettings from "../common/themes/UISettings";
import SettingNotification from "./SettingNotification";
import SettingMessage from "./SettingMessage";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import useConversationStore from "@/store/useConversationStore";

import { slideVariants, headerVariants } from "@/components/animations/sidebarAnimations.js";
import { AnimatedDiv, AnimatedPresence } from "../animations/AnimatedWrapper";

const Sidebar = ({ className = "" }) => {
    const [settingTab, setSettingTab] = useState(null);
    const [direction, setDirection] = useState(0);

    const { activeTab, setActiveTab } = useConversationStore();
    const isMainTab = !settingTab;

    const handleTabChange = useCallback(
        (nextTab) => {
            if (["theme", "notification", "message"].includes(nextTab)) {
                setDirection(1);
                setSettingTab(nextTab);
                return;
            }

            if (activeTab !== nextTab) {
                setActiveTab(nextTab);
            }
        },
        [activeTab, setActiveTab]
    );

    const handleGoBack = useCallback(() => {
        setDirection(-1);
        setSettingTab(null);
    }, []);

    // Memoize content để tránh re-render
    const content = useMemo(() => {
        if (settingTab) {
            switch (settingTab) {
                case "theme":
                    return <UISettings />;
                case "notification":
                    return <SettingNotification />;
                case "message":
                    return <SettingMessage />;
                default:
                    return null;
            }
        }

        return activeTab === "groups" ? <GroupList /> : <UserList />;
    }, [settingTab, activeTab]);

    const headerTitle = useMemo(() => {
        switch (settingTab) {
            case "theme":
                return "Giao diện";
            case "notification":
                return "Cài đặt thông báo";
            case "message":
                return "Cài đặt tin nhắn";
            default:
                return "";
        }
    }, [settingTab]);

    return (
        <aside className={`flex flex-col bg-card ${className}`}>
            {/* Header - Không dùng overflow-hidden để tránh repaint */}
            <div className="relative h-14 sm:h-[56px] border-b border-border">
                <AnimatedPresence mode="wait">
                    {isMainTab ? (
                        <AnimatedDiv
                            key="main-header"
                            variants={headerVariants}
                            className="absolute inset-0"
                        >
                            <SidebarHeader onChangeTab={handleTabChange} />
                        </AnimatedDiv>
                    ) : (
                        <AnimatedDiv
                            key="sub-header"
                            variants={headerVariants}
                            className="absolute inset-0 flex items-center justify-between px-2 sm:px-3"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleGoBack}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                            >
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </Button>

                            <span className="text-sm sm:text-base font-semibold truncate px-2">
                                {headerTitle}
                            </span>

                            <div className="w-8 sm:w-10" />
                        </AnimatedDiv>
                    )}
                </AnimatedPresence>
            </div>

            {/* Tabs - Không animate */}
            {isMainTab && (
                <div className="border-b border-border bg-card px-2 sm:px-3 py-1.5 sm:py-2">
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                        <TabsList className="grid grid-cols-2 w-full bg-muted/30 rounded-md h-9 sm:h-10">
                            <TabsTrigger
                                value="users"
                                className="text-xs sm:text-sm data-[state=active]:bg-accent/80 dark:data-[state=active]:bg-accent data-[state=active]:text-background data-[state=active]:font-medium"
                            >
                                Bạn bè
                            </TabsTrigger>

                            <TabsTrigger
                                value="groups"
                                className="text-xs sm:text-sm data-[state=active]:bg-accent/80 dark:data-[state=active]:bg-accent data-[state=active]:text-background data-[state=active]:font-medium"
                            >
                                Nhóm
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            )}

            {/* Content Area - Tối ưu animation */}
            <div className="relative flex-1 overflow-hidden">
                <AnimatedPresence mode="wait" initial={false}>
                    <AnimatedDiv
                        key={settingTab || activeTab}
                        variants={slideVariants}
                        custom={direction}
                        className="absolute inset-0"
                    >
                        {/* ScrollArea bên trong AnimatedDiv */}
                        <ScrollArea className="h-full">
                            <div className="p-2 sm:p-3">
                                {content}
                            </div>
                        </ScrollArea>
                    </AnimatedDiv>
                </AnimatedPresence>
            </div>
        </aside>
    );
};

export default React.memo(Sidebar);
