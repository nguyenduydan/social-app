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
});

const PersonalInfoForm = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { updateUserInfo } = useUserStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(infoSchema),
        defaultValues: {
            username: user?.username || "",
            displayName: user?.displayName || "",
            phone: user?.phone || "",
            bio: user?.bio || "",
        },
    });

    // Reset form khi user thay đổi (vd sau reload)
    useEffect(() => {
        reset({
            username: user?.username || "",
            displayName: user?.displayName || "",
            phone: user?.phone || "",
            bio: user?.bio || "",
        });
    }, [user, reset]);

    const onSubmit = async (values) => {
        try {
            await updateUserInfo(user._id, values);
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
                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </div>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                    </Button>
                ) : null}
            </CardHeader>

            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                {...register("username")}
                                disabled={!isEditing}
                            />
                            {errors.username && (
                                <p className="text-sm text-red-500">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="displayName">Tên hiển thị</Label>
                            <Input
                                id="displayName"
                                {...register("displayName")}
                                disabled={!isEditing}
                            />
                            {errors.displayName && (
                                <p className="text-sm text-red-500">{errors.displayName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input id="phone" {...register("phone")} disabled={!isEditing} />
                            {errors.phone && (
                                <p className="text-sm text-red-500">{errors.phone.message}</p>
                            )}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bio">Giới thiệu</Label>
                            <Textarea
                                id="bio"
                                {...register("bio")}
                                disabled={!isEditing}
                                className="min-h-[80px]"
                            />
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
                            <Button type="submit" disabled={isSubmitting} className="gap-2">
                                <Save className="h-4 w-4" />
                                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                            </Button>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

export default PersonalInfoForm;
