import React, { useState } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { predefinedThemes } from './predefinedThemes';

const UISettings = () => {
    const {
        enableAnimation,
        theme,
        setEnableAnimation,
        setTheme,
        setCustomBackground,
        resetSettings
    } = useUIStore();

    const [previewImage, setPreviewImage] = useState(null);

    const handleThemeSelect = (themeId) => {
        const selectedTheme = predefinedThemes.find(t => t.id === themeId);
        if (selectedTheme) {
            setTheme(selectedTheme);
            setPreviewImage(null);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target?.result;
                setPreviewImage(imageUrl);

                // Create custom theme with image
                const customTheme = {
                    id: 'custom',
                    name: 'Tùy chỉnh',
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    blur: true,
                    preview: imageUrl,
                    messageSent: {
                        bg: 'rgba(0, 132, 255, 0.85)',
                        text: '#ffffff'
                    },
                    messageReceived: {
                        bg: 'rgba(255, 255, 255, 0.85)',
                        text: '#1f2937'
                    }
                };

                setTheme(customTheme);
                setCustomBackground(imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCustomImage = () => {
        setPreviewImage(null);
        setCustomBackground(null);
        handleThemeSelect('default');
    };

    const currentThemePreview = predefinedThemes.find(t => t.id === theme?.id) || theme;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="bg-card rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-2 text-foreground">Cài đặt giao diện</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Tùy chỉnh giao diện chat theo phong cách của bạn
                </p>

                {/* Animation Setting */}
                <div className="mb-8 p-4 border border-border rounded-lg bg-card/50">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-md font-semibold text-foreground mb-1">
                                Hiệu ứng chuyển động
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Bật/tắt tất cả animation trong ứng dụng
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                className="sr-only peer"
                                type="checkbox"
                                checked={enableAnimation}
                                onChange={(e) => setEnableAnimation(e.target.checked)}
                            />
                            <div className="peer ring-2 ring-border bg-gradient-to-r from-rose-400 to-red-900 rounded-full outline-none duration-500 after:duration-300 w-15 h-5 shadow-inner peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ring after:content-[''] after:rounded-full after:absolute after:outline-none after:h-8 after:w-8 after:bg-background after:-top-1.5 after:-left-2 after:flex after:justify-center after:items-center after:border-4 after:border-border peer-checked:after:translate-x-10"></div>
                        </label>
                    </div>
                </div>

                {/* Theme Selection */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground mb-3">
                            Chọn theme
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Theme sẽ thay đổi màu nền và bong bóng tin nhắn
                        </p>
                    </div>

                    {/* Predefined Themes */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                        {predefinedThemes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => handleThemeSelect(t.id)}
                                className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${theme?.id === t.id
                                    ? 'border-primary ring-2 ring-primary/20'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <div
                                    className="w-full h-20 rounded-md mb-2"
                                    style={{
                                        background: t.background,
                                        backgroundColor: t.preview
                                    }}
                                />
                                <div className="text-center">
                                    <div className="font-medium text-sm text-foreground">
                                        {t.name}
                                    </div>
                                    {theme?.id === t.id && (
                                        <div className="mt-1 text-xs text-primary font-semibold">
                                            ✓ Đang dùng
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Custom Image Upload */}
                    <div className="mt-6 p-4 border border-border rounded-lg bg-card/50">
                        <h3 className="text-base font-semibold text-foreground mb-3">
                            Tải lên hình nền tùy chỉnh
                        </h3>

                        {previewImage ? (
                            <div className="relative">
                                <div
                                    className="w-full h-48 rounded-lg bg-cover bg-center"
                                    style={{ backgroundImage: `url(${previewImage})` }}
                                />
                                <button
                                    onClick={removeCustomImage}
                                    className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/30">
                                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">
                                    Nhấn để tải lên hình ảnh
                                </span>
                                <span className="text-xs text-muted-foreground mt-1">
                                    JPG, PNG, GIF (Max 5MB)
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Preview Section */}
                <div className="mt-8 p-4 border border-border rounded-lg bg-card/50">
                    <h2 className="text-lg font-semibold text-foreground mb-3">
                        Xem trước
                    </h2>
                    <div
                        className="relative p-6 rounded-lg min-h-48"
                        style={{
                            backgroundImage: currentThemePreview?.backgroundImage || currentThemePreview?.background?.includes('gradient') || currentThemePreview?.background?.includes('url(') ? currentThemePreview.background : undefined,
                            backgroundColor: !currentThemePreview?.backgroundImage && currentThemePreview?.background && !currentThemePreview.background.includes('gradient') && !currentThemePreview.background.includes('url(') ? currentThemePreview.background : undefined,
                            backgroundSize: currentThemePreview?.backgroundSize || 'auto',
                            backgroundPosition: currentThemePreview?.backgroundPosition || 'center'
                        }}
                    >
                        {/* Header Preview */}
                        <div className="absolute top-0 left-0 right-0 p-3 backdrop-blur-md bg-background/30 border-b border-white/10">
                            <div className="text-sm font-semibold text-foreground/90">Chat Preview</div>
                        </div>

                        {/* Messages Preview */}
                        <div className="pt-12 space-y-3">
                            <div className="flex justify-end">
                                <div
                                    className="px-4 py-2 rounded-2xl max-w-xs shadow-lg"
                                    style={{
                                        backgroundColor: currentThemePreview?.messageSent.bg,
                                        color: currentThemePreview?.messageSent.text
                                    }}
                                >
                                    Tin nhắn của bạn
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div
                                    className="px-4 py-2 rounded-2xl max-w-xs shadow-lg"
                                    style={{
                                        backgroundColor: currentThemePreview?.messageReceived.bg,
                                        color: currentThemePreview?.messageReceived.text
                                    }}
                                >
                                    Tin nhắn nhận được
                                </div>
                            </div>
                        </div>

                        {/* Input Preview */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 backdrop-blur-md bg-background/30 border-t border-white/10">
                            <div className="h-10 bg-muted/50 rounded-full px-4 flex items-center">
                                <span className="text-sm text-muted-foreground">Nhập tin nhắn...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Theme Info */}
                <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Theme hiện tại:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Tên: <strong className="text-foreground">{theme?.name || 'Mặc định'}</strong></li>
                        <li>• Animation: <strong className="text-foreground">{enableAnimation ? 'Bật' : 'Tắt'}</strong></li>
                        <li>• Lưu trữ: <strong className="text-foreground">Zustand + LocalStorage</strong></li>
                    </ul>
                </div>

                {/* Reset Button */}
                <div className="mt-6 text-center">
                    <Button
                        onClick={resetSettings}
                        className="px-6"
                    >
                        Đặt lại về mặc định
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UISettings;
