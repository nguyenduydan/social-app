import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../ui/tabs";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // 👈 thêm dòng này
import ProfileHeader from "./ProfileHeader";
import PersonalInfoForm from "./PersonalInfoForm";
import AccountSettings from "./AccountSettings";
import ActivityTimeline from "./ActivityTimeline";

const ProfileMain = ({ user }) => {
    const [activeTab, setActiveTab] = useState("personal");
    const { user: currentUser } = useAuthStore();

    const isOwner = currentUser?._id === user?._id;

    // Ẩn menu “Cài đặt” với người khác
    const menus = [
        { value: "personal", label: "Thông tin người dùng" },
        { value: "friends", label: "Danh sách bạn bè" },
        { value: "posts", label: "Danh sách bài viết" },
        { value: "followers", label: "Người theo dõi" },
        { value: "following", label: "Đang theo dõi" },
        ...(isOwner
            ? [
                { value: "activity", label: "Hoạt động" },
                { value: "settings", label: "Cài đặt" },
            ]
            : []),
    ];

    const activities = [
        { title: "Profile Updated", description: "You updated your profile", date: "2 hours ago" },
        { title: "Password Changed", description: "You changed your password", date: "1 day ago" },
        { title: "Email Verified", description: "Your email was verified", date: "3 days ago" },
    ];

    return (
        <div className="md:container mx-auto max-w-5xl space-y-5 bg-card shadow-lg pb-20 md:pb-40 rounded-md overflow-hidden">
            {/* Header vẫn hiển thị avatar, cover, tên... */}
            <ProfileHeader user={user} />

            <Tabs
                defaultValue="personal"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full bg-card rounded-md"
            >
                <div className="flex flex-col md:flex-row relative">
                    {/* === Mobile Popover Menu === */}
                    <div className="block md:hidden p-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between border-none group">
                                    {menus.find((m) => m.value === activeTab)?.label || "Chọn mục"}
                                    <ChevronDown
                                        className="w-4 h-4 ml-2 opacity-70 transition-transform duration-300 group-data-[state=open]:rotate-180"
                                    />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[calc(100vw-2rem)] border-none">
                                <div className="flex flex-col gap-1">
                                    {menus.map((menu) => (
                                        <Button
                                            key={menu.value}
                                            variant="ghost"
                                            onClick={() => setActiveTab(menu.value)}
                                            className={`w-full text-left px-3 py-2 rounded-md ${activeTab === menu.value
                                                ? "bg-primary-glow/20"
                                                : "hover:bg-muted"
                                                }`}
                                        >
                                            {menu.label}
                                        </Button>
                                    ))}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* === Desktop Sidebar TabsList === */}
                    <TabsList className="hidden md:flex bg-card h-full flex-col py-10 justify-evenly gap-1 rounded-l-md min-w-[220px] border-r">
                        {menus.map((menu) => (
                            <TabsTrigger
                                key={menu.value}
                                value={menu.value}
                                className="justify-start w-full px-4 py-3 rounded-md cursor-pointer border-b dark:data-[state=active]:bg-white/10 data-[state=active]:bg-primary-glow/20"
                            >
                                {menu.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* === Tab Contents === */}
                    <div className="flex-1 p-0 md:p-6">
                        <TabsContent value="personal">
                            <PersonalInfoForm user={user} />
                        </TabsContent>

                        {isOwner && (
                            <TabsContent value="settings">
                                <AccountSettings />
                            </TabsContent>
                        )}
                        {isOwner && (
                            <TabsContent value="activity">
                                <ActivityTimeline activities={activities} />
                            </TabsContent>
                        )}
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default ProfileMain;
