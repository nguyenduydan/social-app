import React, { useState } from 'react';
import ProfileHeader from './ProfileHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import PersonalInfoForm from './PersonalInfoForm';
import AccountSettings from './AccountSettings';
import ActivityTimeline from './ActivityTimeline';

const ProfileMain = () => {

    const [user, setUser] = useState({
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '+84 123 456 789',
        location: 'Hà Nội, Việt Nam',
        bio: 'Full-stack developer passionate about building great products',
        role: 'Senior Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    });

    // const [originalUser, setOriginalUser] = useState(user);

    const activities = [
        {
            title: 'Profile Updated',
            description: 'You updated your profile information',
            date: '2 hours ago'
        },
        {
            title: 'Password Changed',
            description: 'Your password was successfully changed',
            date: '1 day ago'
        },
        {
            title: 'Email Verified',
            description: 'Your email address was verified',
            date: '3 days ago'
        }
    ];

    const menus = [
        { value: "personal", label: "Thông tin người dùng" },
        { value: "friends", label: "Danh sách bạn bè" },
        { value: "posts", label: "Danh sách bài viết" },
        { value: "followers", label: "Danh sách người theo dõi" },
        { value: "following", label: "Danh sách đang theo dõi" },
        { value: "activity", label: "Hoạt động" },
        { value: "settings", label: "Cài đặt" },
    ];


    const handleChange = (field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-5 bg-card shadow-lg pb-40">
            <ProfileHeader user={user} />

            <Tabs defaultValue="personal" className="w-full bg-card rounded-md px-5 ">
                <div className='flex relative'>
                    {/* Menu bên trái */}
                    <TabsList
                        className="bg-card h-full flex flex-col py-10 justify-evenly gap-1 rounded-l-md "
                    >
                        {menus.map((menu, index) => (
                            <TabsTrigger
                                key={index}
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
                                user={user}
                                onChange={handleChange}
                            />
                        </TabsContent>

                        <TabsContent value="friends">
                            <AccountSettings />
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
