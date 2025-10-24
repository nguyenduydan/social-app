import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Camera, Edit2, Mail, MapPin, Phone } from 'lucide-react';
import { Badge } from '../ui/badge';

const ProfileHeader = ({ user }) => {
    const stats = [
        { label: 'Bài viết', value: 142 },
        { label: 'Người theo dõi', value: 1254 },
        { label: 'Đang theo dõi', value: 389 }
    ];

    return (
        <Card className="border-none shadow-none py-0">
            <CardContent className="px-0">
                <div className="flex flex-col md:flex-col items-start gap-6">
                    <CardHeader className="relative w-full flex flex-col items-center justify-center gap-6 px-0 pb-16">
                        {/* Cover photo */}
                        <div className="relative w-full h-60">
                            {user?.coverPhoto?.url ? (
                                <img
                                    src={user?.coverPhoto?.url || ""}
                                    alt={user?.displayName || "Cover photo"}
                                    className="absolute inset-0 w-full h-full object-cover bg-gradient-to-br from-blue-500 to-purple-600"
                                />
                            ) : (
                                <div className="absolute inset-0 w-full h-full bg-gradient-primary" />
                            )}
                            <div className="absolute bottom-1 right-2 bg-background rounded-full p-1">
                                <Camera />
                            </div>
                        </div>

                        {/* Avatar positioned absolutely */}
                        <div className="absolute -bottom-5 left-10 z-10">
                            <div className="relative">
                                <Avatar className="h-32 w-32 ring-offset-4 ring-offset-background transition-all duration-300 hover:ring-primary/40 hover:scale-105">
                                    <AvatarImage
                                        src={user?.avatar?.url}
                                        alt={user?.displayName || "User avatar"}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {user?.displayName?.charAt(0) || user?.name?.charAt(0) || "?"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-1 right-2 bg-background rounded-full p-1">
                                    <Camera />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <div className="flex-1 text-left pl-10 space-y-5">
                        <div className='flex items-center gap-4'>
                            <h1 className="text-3xl font-bold">{user?.displayName || "Nguyen Van A"}</h1>
                            <CardDescription className="text-base">@{user?.username || "username"}</CardDescription>
                        </div>
                        <div className='flex justify-between items-center gap-10'>
                            {stats.map((stat) => (
                                <Badge
                                    key={stat.label}
                                    variant="secondary"
                                    className="flex flex-row items-center gap-2 shadow-sm px-5"
                                >

                                    <span className="text-lg text-muted-foreground">
                                        {stat.label}
                                    </span>
                                    <span className="text-lg">
                                        {stat.value}
                                    </span>
                                </Badge>
                            ))}
                        </div>
                        <p className="text-muted-foreground mb-4">{user?.bio || ""}</p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.email || ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.phone || ""}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{user?.location || ""}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileHeader;
