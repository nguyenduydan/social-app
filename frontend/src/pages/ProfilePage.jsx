import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import LoadPage from "@/components/common/loaders/LoadPage";
import ProfileMain from "@/components/Profile/ProfileMain";

const Profile = () => {
    const { user } = useAuthStore();
    const { username } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchUserById, currentUser, loading } = useUserStore();

    useEffect(() => {
        const userId = location.state?.userId;

        if (userId) {
            // Xem profile người khác
            fetchUserById(userId);
        } else if (user) {
            // Nếu là profile cá nhân (hoặc refresh lại)
            fetchUserById(user._id);
        } else {
            navigate("/login");
        }
    }, [username]);

    if (loading) return <LoadPage />;

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
                Không tìm thấy người dùng
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <ProfileMain
                user={currentUser}
                isOwner={user?._id === currentUser?._id}
            />
        </div>
    );
};

export default Profile;
