import { Accessibility, Bell, Calendar, Home, Lock, Settings } from "lucide-react";

export const sidebarLinks = [
    {
        name: "Dashboard",
        icon: <Home size={ 20} />,
    path: "/"
    },
{
    name: "Inventory",
        icon: <Calendar size={ 20 } />,
    path: "/inventory",
        subMenu: true,
            subMenuItems: [
                {
                    name: "Intake Form",
                    path: "/inventory/intake-form"
                },
                {
                    name: "Storage View",
                    path: "/inventory/storage-view"
                },
                {
                    name: "Dispatch Form",
                    path: "/inventory/dispatch-form"
                }
            ]
},
{
    name: "Surveillance",
        icon: <Lock size={ 20 } />,
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
        icon: <Accessibility size={ 20 } />,
    path: "/access-control"
},
{
    name: "Notifications",
        icon: <Bell size={ 20 } />,
    path: "/notifications"
},
{
    name: "Settings",
        icon: <Settings size={ 20 } />,
    path: "/settings"
}
]