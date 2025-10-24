import React, { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PersonalInfoForm from "./PersonalInfoForm";
import AccountSettings from "./AccountSettings";
import ActivityTimeline from "./ActivityTimeline";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

const ProfileMain = () => {
    const { user } = useAuthStore();
    const { currentUser, fetchUserById, loading } = useUserStore();

    useEffect(() => {
        fetchUserById(user._id);
    }, []);

    // Nếu chưa đăng nhập hoặc chưa có user
    if (!currentUser) {
        return (
            <div className="flex justify-center items-center h-[300px] text-muted-foreground">
                Vui lòng đăng nhập để xem hồ sơ cá nhân
            </div>
        );
    }

    const menus = [
        { value: "personal", label: "Thông tin người dùng" },
        { value: "friends", label: "Danh sách bạn bè" },
        { value: "posts", label: "Danh sách bài viết" },
        { value: "followers", label: "Người theo dõi" },
        { value: "following", label: "Đang theo dõi" },
        { value: "activity", label: "Hoạt động" },
        { value: "settings", label: "Cài đặt" },
    ];

    const activities = [
        { title: "Profile Updated", description: "You updated your profile", date: "2 hours ago" },
        { title: "Password Changed", description: "You changed your password", date: "1 day ago" },
        { title: "Email Verified", description: "Your email was verified", date: "3 days ago" },
    ];

    return (
        <div className="space-y-5 bg-card shadow-lg pb-40">
            <ProfileHeader user={currentUser} />

            <Tabs defaultValue="personal" className="w-full bg-card rounded-md px-5">
                <div className="flex relative">
                    {/* Menu bên trái */}
                    <TabsList className="bg-card h-full flex flex-col py-10 justify-evenly gap-1 rounded-l-md">
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

                    {/* Nội dung bên phải */}
                    <div className="flex-1 p-6">
                        <TabsContent value="personal">
                            <PersonalInfoForm
                                user={currentUser}
                                isSaving={loading}
                            />
                        </TabsContent>

                        <TabsContent value="settings">
                            <AccountSettings />
                        </TabsContent>

                        <TabsContent value="activity">
                            <ActivityTimeline activities={activities} />
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};

export default ProfileMain;
