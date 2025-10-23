import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Edit, Save, X } from 'lucide-react';
import { Button } from '../ui/button';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
    email: z.email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const PersonalInfoForm = ({ user, onSave, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);

    // console.log("isEditing:", isEditing);
    return (
        <Card className="rounded-none rounded-b-md border-none shadow-none">
            <CardHeader className="flex justify-between">
                <div>
                    <CardTitle>Thông tin người dùng</CardTitle>
                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
                </div>
                <Button
                    onClick={() => (setIsEditing(true))}
                >
                    <Edit />
                    Chỉnh sửa
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên đầy đủ</Label>
                        <Input
                            id="name"
                            value={user.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                            id="phone"
                            value={user.phone}
                            onChange={(e) => onChange('phone', e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Địa chỉ</Label>
                        <Input
                            id="location"
                            value={user.location}
                            onChange={(e) => onChange('location', e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Mô tả</Label>
                        <Input
                            id="bio"
                            value={user.bio}
                            onChange={(e) => onChange('bio', e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="flex gap-2 justify-end pt-4">
                        <Button variant="outline" onClick={() => setIsEditing(false)} className="gap-2">
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button onClick={onSave} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PersonalInfoForm;
