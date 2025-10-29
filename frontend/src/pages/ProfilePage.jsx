import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import LoadPage from "@/components/common/loaders/LoadPage";
import ProfileMain from "@/components/Profile/ProfileMain";

const Profile = () => {
    const { user, loading: authLoading } = useAuthStore();
    const { username } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchUserById, fetchUserByUsername, currentUser, loading } = useUserStore();

    useEffect(() => {
        // Nếu đang load user auth thì chờ
        if (authLoading) return;

        // Nếu chưa đăng nhập -> chuyển hướng login
        if (!user) {
            navigate("/login", { replace: true });
            return;
        }

        const userId = location.state?.userId;

        if (userId) {
            // Trường hợp xem profile từ click (có state)
            fetchUserById(userId);
        } else if (username && username !== user.username) {
            // Trường hợp xem profile người khác qua URL trực tiếp
            fetchUserByUsername(username);
        } else {
            // Trường hợp xem profile cá nhân
            fetchUserById(user._id);
        }
    }, [username, user, authLoading, location.state, navigate, fetchUserById, fetchUserByUsername]);

    if (authLoading || loading) return <LoadPage />;

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-background">
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
