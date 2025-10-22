import { Home, MessageSquareText, Settings, User } from "lucide-react";
import HomePage from "@/pages/HomePage";
import Profile from "./pages/ProfilePage";

const routes = [
    {
        name: "Home",
        layout: "/client",
        path: "/",
        icon: <Home className="size-4 md:size-6" />,
        element: <HomePage />
    },
    {
        name: "Messages",
        layout: "/client",
        path: "/messages",
        icon: <MessageSquareText className="size-4 md:size-6" />,
        element: <HomePage />
    },
    {
        name: "Profile",
        layout: "/client",
        path: "/profile",
        icon: <User className="size-4 md:size-6" />,
        element: <Profile />
    },
    {
        name: "Settings",
        layout: "/client",
        path: "/settings",
        icon: <Settings className="size-4 md:size-6" />,
        element: <HomePage />
    },
];

export default routes;
