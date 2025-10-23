import { Home, MessageSquareText, Search, Settings, User } from "lucide-react";
import HomePage from "@/pages/HomePage";
import Profile from "./pages/ProfilePage";

const routes = [
    {
        name: "Trang chủ",
        layout: "/client",
        path: "/",
        icon: <Home className="size-4 md:size-6" />,
        element: <HomePage />
    },
    {
        name: "Tin nhắn",
        layout: "/client",
        path: "/messages",
        icon: <MessageSquareText className="size-4 md:size-6" />,
        element: <HomePage />
    },
    {
        name: "Cá nhân",
        layout: "/client",
        path: "/profile",
        icon: <User className="size-4 md:size-6" />,
        element: <Profile />
    },
    {
        name: "Tìm kiếm",
        layout: "/client",
        path: "/search",
        icon: <Search className="size-4 md:size-6" />,
        element: <HomePage />
    },
];

export default routes;
