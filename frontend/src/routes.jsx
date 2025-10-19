import { Home, MessageSquareText, Settings, User } from "lucide-react";
import HomePage from "@/pages/HomePage";
import Profile from "./pages/ProfilePage";

const routes = [
    {
        name: "Home",
        layout: "/client",
        path: "/",
        icon: <Home />,
        element: <HomePage />
    },
    {
        name: "Messages",
        layout: "/client",
        path: "/messages",
        icon: <MessageSquareText />,
        element: <HomePage />
    },
    {
        name: "Profile",
        layout: "/client",
        path: "/profile",
        icon: <User />,
        element: <Profile />
    },
    {
        name: "Settings",
        layout: "/client",
        path: "/settings",
        icon: <Settings />,
        element: <HomePage />
    },
];

export default routes;
