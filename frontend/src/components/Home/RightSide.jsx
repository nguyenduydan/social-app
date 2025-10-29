import { useEffect } from "react";
import FollowSuggestions from "../Friends/FollowSuggestions";
import FriendList from "../Friends/FriendListHome";
import { useFriendStore } from "@/store/useFriendStore";

const RightSide = () => {
    const {
        friends,
        suggestions,
        getFriendAll,
        getRequest,
        getSuggestions,
        loading,
    } = useFriendStore();

    useEffect(() => {
        // Tải dữ liệu khi mount
        getFriendAll(1, false, 10);
        getRequest();
        getSuggestions();
    }, [getFriendAll, getRequest, getSuggestions]);

    return (
        <div className="flex flex-col w-full space-y-4">
            {/* --- Gợi ý theo dõi --- */}
            <FollowSuggestions users={suggestions} loading={loading} />

            {/* --- Danh sách bạn bè --- */}
            <FriendList friends={friends} loading={loading} />
        </div>
    );
};

export default RightSide;;
