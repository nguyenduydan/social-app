import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Edit, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/store/useUserStore";
import { Spinner } from "../ui/spinner";
import { DateOfBirthField } from "../common/DatePickerField";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";

const infoSchema = z.object({
    username: z
        .string()
        .min(1, "Tên người dùng không được để trống")
        .max(100, "Tên người dùng không được vượt quá 100 ký tự")
        .regex(/^[a-zA-Z0-9]+$/, "Tên người dùng chỉ được chứa chữ cái và số"),
    displayName: z.string().min(2, "Tên hiển thị quá ngắn"),
    phone: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^\+?[0-9]{7,15}$/.test(val),
            "Số điện thoại không hợp lệ"
        ),
    bio: z.string().max(500, "Mô tả không quá 500 ký tự").optional(),
    location: z.string().optional(),
    birthDay: z
        .date()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                const now = new Date();
                return val < now && val.getFullYear() > 1900;
            },
            "Ngày sinh không hợp lệ"
        ),
    linkSocialOther: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                try {
                    new URL(val);
                    return true;
                } catch {
                    return false;
                }
            },
            "URL không hợp lệ (ví dụ: https://example.com)"
        )
});

const PersonalInfoForm = ({ user }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const { updateUserInfo, updating } = useUserStore();
    const maxChars = 500;

    const isOwner = currentUser?._id === user?._id;

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(infoSchema),
        defaultValues: {
            username: user?.username || "",
            displayName: user?.displayName || "",
            phone: user?.phone || "",
            bio: user?.bio || "",
            location: user?.location || "",
            birthDay: user?.birthDay ? new Date(user.birthDay) : undefined,
            linkSocialOther: user?.linkSocialOther || "",
        },
    });


    useEffect(() => {
        reset({
            username: user?.username || "",
            displayName: user?.displayName || "",
            phone: user?.phone || "",
            bio: user?.bio || "",
            location: user?.location || "",
            birthDay: user?.birthDay ? new Date(user.birthDay) : undefined,
        });
    }, [user, reset]);

    const bioValue = watch("bio") || "";
    const charCount = bioValue.length;

    const onSubmit = async (values) => {
        try {
            await updateUserInfo(user._id, values, navigate);
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
        }
    };

    return (
        <Card className="rounded-none rounded-b-md border-none shadow-none">
            <CardHeader className="flex justify-between items-center">
                <div>
                    <CardTitle>Thông tin người dùng</CardTitle>
                </div>
                {isOwner && !isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                    </Button>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register("username")} disabled={!isEditing} placeholder="user1" />
                            {errors.username && (
                                <p className="text-sm text-red-500">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Display name */}
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Tên hiển thị</Label>
                            <Input id="displayName" {...register("displayName")} disabled={!isEditing} placeholder="Nguyen Van A" />
                            {errors.displayName && (
                                <p className="text-sm text-red-500">{errors.displayName.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input id="phone" {...register("phone")} disabled={!isEditing} placeholder="Số điệnt thoại (ex: 0123456789)" />
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Date of birth */}
                        <DateOfBirthField control={control} disabled={!isEditing} />

                        {/* LinkSocialOther */}
                        <div className="space-y-2">
                            <Label htmlFor="linkSocialOther">Liên kết mạng xã hội khác</Label>
                            <Input id="linkSocialOther" {...register("linkSocialOther")} disabled={!isEditing} placeholder="https://example.com/yourprofile" type="url" />
                            {errors.linkSocialOther && (
                                <p className="text-sm text-red-500">{errors.linkSocialOther.message}</p>
                            )}
                        </div>

                        {/* Mail */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={currentUser.email} disabled={true} />
                        </div>

                        {/* Location */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="location">Địa chỉ</Label>
                            <Input id="location" {...register("location")} disabled={!isEditing} placeholder="Ví dụ: Nha Trang, Khánh Hòa" />
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location.message}</p>
                            )}
                        </div>


                        {/* Bio */}
                        <div className="space-y-2 md:col-span-2 relative">
                            <Label htmlFor="bio">Giới thiệu</Label>
                            <Textarea
                                id="bio"
                                {...register("bio")}
                                disabled={!isEditing}
                                className="min-h-[80px]"
                                placeholder="Mô tả bản thân"
                            />
                            <div className="absolute bottom-2 right-4">
                                <span
                                    className={`text-sm ${charCount > maxChars * 0.9
                                        ? "text-red-500"
                                        : "text-gray-400"
                                        }`}
                                >
                                    {charCount}/{maxChars}
                                </span>
                            </div>
                            {errors.bio && (
                                <p className="text-sm text-red-500">{errors.bio.message}</p>
                            )}
                        </div>

                    </div>

                    {isEditing && (
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    reset();
                                    setIsEditing(false);
                                }}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Hủy
                            </Button>
                            <Button type="submit" disabled={updating} className="gap-2">
                                <Save className="h-4 w-4" />
                                {updating ? (
                                    <>
                                        <Spinner /> Đang lưu...
                                    </>
                                ) : (
                                    "Lưu thay đổi"
                                )}
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default PersonalInfoForm;
