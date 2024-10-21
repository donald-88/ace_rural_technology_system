import { Accessibility, Bell, Calendar, Home, Lock, Settings } from "lucide-react";

export const sidebarLinks = [
    {
        name: "Dashboard",
        icon: <Home size={20} />,
        path: "/"
    },
    {
        name: "Inventory",
        icon: <Calendar size={20} />,
        path: "/inventory",
    },
    {
        name: "Surveillance",
        icon: <Lock size={20} />,
        path: "/surveillance",
        subMenu: true,
        subMenuItems: [
            {
                name: "Camera Feed",
                path: "/surveillance/camera-feed"
            },
            {
                name: "Sensor Readings",
                path: "/surveillance/sensor-readings"
            }
        ]
    },
    {
        name: "Access Control",
        icon: <Accessibility size={20} />,
        path: "/access-control"
    },
    {
        name: "Notifications",
        icon: <Bell size={20} />,
        path: "/notifications"
    },
    {
        name: "Settings",
        icon: <Settings size={20} />,
        path: "/settings",
        subMenu: true,
        subMenuItems: [
            {
                name: "General",
                path: "/settings/general"
            },
            {
                name: "Teams",
                path: "/settings/teams"
                },
                {
                name: "Help & Support",
                path: "/settings/help"
            }
        ]
    }
]

export const settingsLinks = [
    {
        name: "General",
        path: "/settings/general"
    },
    {
        name: "Teams",
        path: "/settings/teams"
    },
    {
        name: "Help & Support",
        path: "/settings/help"
    },
]