import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import LoadPage from "@/components/common/loaders/LoadPage";
import ProfileMain from "@/components/Profile/ProfileMain";
import PageHeader from "@/components/common/navigation/PageHeader";

const ProfilePage = () => {
    const { user, loading: authLoading } = useAuthStore();
    const { username } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchUserById, fetchUserByUsername, currentUser, loading } = useUserStore();

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        const userId = location.state?.userId;

        if (userId) {
            fetchUserById(userId);
        } else if (username && username !== user.username) {
            fetchUserByUsername(username);
        } else {
            fetchUserById(user._id);
        }
    }, [username, user, authLoading, location.state, navigate, fetchUserById, fetchUserByUsername]);

    if (authLoading || loading) return <LoadPage />;

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-full bg-background">
                <p className="text-muted-foreground">User not found</p>
            </div>
        );
    }

    const isOwnProfile = user?._id === currentUser?._id;

    return (
        <div className="w-full h-full flex flex-col bg-background">
            {/* PAGE TOP BAR - Local to this page */}
            <PageHeader showSearch={false} showActions={true} title={currentUser.displayName} />

            {/* MAIN CONTENT WITH 2 COLUMNS */}
            <div className="flex-1 overflow-hidden flex gap-0">
                {/* PRIMARY COLUMN - Profile Info */}
                <main className="flex-1 overflow-y-auto scrollbar-hide">
                    <ProfileMain user={currentUser} isOwnProfile={isOwnProfile} />
                </main>

                {/* SECONDARY COLUMN - Profile Stats/Widgets (Hidden on tablet/mobile) */}
                <aside className="hidden lg:flex lg:w-72 2xl:w-80 xl:w-96 lg:flex-col lg:border-l lg:border-border/30 lg:bg-card/20 lg:overflow-hidden flex-shrink-0">
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {/* Profile widgets/stats section */}
                        <div className="p-4 sm:p-6 space-y-6" />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ProfilePage;
