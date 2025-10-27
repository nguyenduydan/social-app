import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { FieldSeparator } from '../ui/field';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'react-router';

const InfoUserCard = () => {
    const { user } = useAuthStore();
    const stats = [
        { label: 'Posts', value: 142 },
        { label: 'Followers', value: 1254 },
        { label: 'Following', value: 389 }
    ];

    return (
        <div className='bg-background'>
            <Card className="border-none bg-background overflow-hidden rounded-none py-0 gap-0">
                <CardHeader className="relative flex flex-col items-center justify-center gap-6 px-0 pb-16">
                    {/* Cover photo */}
                    <div className="relative w-full h-32">
                        {user?.coverPhoto?.url ? (
                            <img
                                src={user?.coverPhoto?.url || ""}
                                alt={user?.displayName || "Cover photo"}
                                className="absolute inset-0 w-full h-full object-cover bg-gradient-accent"
                            />
                        ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-accent" />
                        )}
                    </div>

                    {/* Avatar positioned absolutely */}
                    <div className="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2">
                        <div className='relative'>
                            <Avatar className="size-32 ring-offset-4 ring-offset-secondary transition-all duration-300 hover:ring-primary/40 hover:scale-105">
                                <AvatarImage
                                    src={user?.avatar?.url}
                                    alt={user?.displayName || "User avatar"}
                                    className="object-cover"
                                />
                                <AvatarFallback className="text-5xl bg-gradient-chat text-muted">
                                    {user?.displayName?.charAt(0) || "?"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-1 right-2 size-6 bg-status-online rounded-full border-4 border-background" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-10 pb-6">
                    {/* User name */}
                    <div className="text-center space-y-1 mb-4">
                        <CardTitle className="text-2xl font-bold"><Link to={`/profile/${user?.username}`} className="hover:underline">{user?.displayName}</Link></CardTitle>
                        <CardDescription className="text-sm text-foreground/70">
                            @{user?.username || ""}
                        </CardDescription>
                        <CardDescription className="text-sm text-foreground/70">
                            {user?.createdAt
                                ? `Tham gia từ ${new Date(user.createdAt).toLocaleDateString("vi-VN")}`
                                : "Ngày tham gia không xác định"}
                        </CardDescription>
                    </div>

                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-border/50 mb-4" />

                    {/* Stats */}
                    <div className='grid grid-cols-3 gap-4'>
                        {stats.map((stat) => (
                            <button
                                key={stat.label}
                                className="group flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 hover:bg-primary/20 hover:scale-105"
                            >
                                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                                    {stat.value}
                                </span>
                                <span className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors font-medium">
                                    {stat.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-foreground/80 text-center py-5">
                        {user?.bio || "🎨 Content Creator | 📸 Photography Enthusiast | 🌍 Travel Lover"}
                    </p>
                    {/* info */}
                    <div className='flex flex-col gap-5'>
                        <p>
                            <strong>Email:</strong> {user?.email || "not provided"}
                        </p>
                        <p>
                            <strong>Địa chỉ:</strong> {user?.location || "Unknown"}
                        </p>
                        <p>
                            <strong>Mạng xã hội khác:</strong>{" "}
                            {user?.linkSocialOther ? (
                                <a
                                    href={user.linkSocialOther.startsWith("http")
                                        ? user.linkSocialOther
                                        : `https://${user.linkSocialOther}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    {user.linkSocialOther}
                                </a>
                            ) : (
                                <span className="text-gray-500 italic">Chưa liên kết</span>
                            )}
                        </p>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default InfoUserCard;
