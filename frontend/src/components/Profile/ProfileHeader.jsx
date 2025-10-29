import React, { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Camera, Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import ImageEditorDialog from "../common/ImageEditorDialog";
import FriendFollowActions from "./FriendFollowActions";

const ProfileHeader = ({ user }) => {
    const { user: currentUser } = useAuthStore();
    const { updateAvatar, updateCoverPhoto, updating } = useUserStore();

    const isOwner = currentUser?._id === user?._id;

    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    const [imageToEdit, setImageToEdit] = useState(null);
    const [editingType, setEditingType] = useState(null);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageToEdit(url);
            setEditingType("avatar");
            setIsEditorOpen(true);
        }
    };

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageToEdit(url);
            setEditingType("cover");
            setIsEditorOpen(true);
        }
    };

    const handleSaveEditedImage = (croppedFile) => {
        if (editingType === "avatar") updateAvatar(croppedFile);
        if (editingType === "cover") updateCoverPhoto(croppedFile);
    };

    const stats = [
        { label: "Bài viết", value: 142 },
        { label: "Người theo dõi", value: 1254 },
        { label: "Đang theo dõi", value: 389 },
    ];

    return (
        <>
            <Card className="border-none shadow-none py-0">
                <CardContent className="px-0">
                    <div className="flex flex-col md:flex-col items-center md:items-start gap-1 md:gap-6">
                        <CardHeader className="relative w-full flex flex-col items-center justify-center gap-6 px-0 pb-16">
                            {/* === Ảnh bìa === */}
                            <div className="relative w-full h-40 md:h-60">
                                {user?.coverPhoto?.url ? (
                                    <img
                                        src={user.coverPhoto.url}
                                        alt={user.displayName || "Cover photo"}
                                        className="absolute inset-0 w-full h-full object-cover bg-gradient-to-br from-blue-500 to-purple-600"
                                    />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full bg-gradient-primary" />
                                )}

                                {/* Nút thay ảnh bìa (chỉ chủ sở hữu) */}
                                {isOwner && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            onClick={() => coverInputRef.current.click()}
                                            className="absolute bottom-1 right-2 bg-transparent rounded-full p-1 hover:opacity-80 transition"
                                        >
                                            <Camera className="size-4 md:size-8 text-foreground" />
                                        </Button>
                                        <input
                                            ref={coverInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleCoverChange}
                                        />
                                    </>
                                )}
                            </div>

                            {/* === Avatar === */}
                            <div className="absolute left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 bottom-0 md:-bottom-5 z-10">
                                <div className="relative">
                                    <Avatar className="h-40 w-40 md:h-32 md:w-32 ring-offset-4 ring-offset-background transition-all duration-300 hover:ring-primary/40 hover:scale-105">
                                        <AvatarImage
                                            src={user?.avatar?.url}
                                            alt={user?.displayName || "User avatar"}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            {user?.displayName?.charAt(0) || "?"}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Nút thay avatar (chỉ chủ sở hữu) */}
                                    {isOwner && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                onClick={() => avatarInputRef.current.click()}
                                                className="absolute bottom-1 right-8 bg-transparent rounded-full p-1 hover:opacity-80 transition"
                                            >
                                                <Camera className="size-4 md:size-8" />
                                            </Button>
                                            <input
                                                ref={avatarInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        {/* === Thông tin người dùng === */}
                        <div className="w-full text-center md:text-left pl-0 md:pl-10 space-y-5">
                            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
                                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
                                    <h1 className="text-xl md:text-3xl font-bold">
                                        {user?.displayName || "Nguyen Van A"}
                                    </h1>
                                    <CardDescription className="text-sm md:text-base">
                                        @{user?.username || "username"}
                                    </CardDescription>
                                    <CardDescription className="italic">
                                        {user?.createdAt
                                            ? `Tham gia từ ${new Date(user.createdAt).toLocaleDateString("vi-VN")}`
                                            : "Ngày tham gia không xác định"}
                                    </CardDescription>
                                </div>

                                {/* Friend & Follow Actions - Only show for other users */}
                                {!isOwner && (
                                    <FriendFollowActions userId={user?._id} className="mr-10" />
                                )}
                            </div>

                            <div className="flex justify-start items-center gap-5 md:gap-10">
                                {stats.map((stat) => (
                                    <Badge
                                        key={stat.label}
                                        variant="secondary"
                                        className="flex flex-col md:flex-row items-center gap-0 md:gap-2 shadow-sm px-5"
                                    >
                                        <span className="text-sm md:text-lg text-muted-foreground">
                                            {stat.label}
                                        </span>
                                        <span className="text-sm md:text-lg">{stat.value}</span>
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

            {/* === Modal chỉnh sửa ảnh === */}
            <ImageEditorDialog
                open={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
                imageSrc={imageToEdit}
                onSave={handleSaveEditedImage}
                aspect={editingType === "cover" ? 16 / 9 : 1}
                loading={updating}
            />
        </>
    );
};

export default ProfileHeader;
