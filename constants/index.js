import {
    AudioWaveform,
    Bot,
    Bell,
    Command,
    Cctv, Home,
    GalleryVerticalEnd,
    Settings2,
    ShieldAlert
} from "lucide-react"

export const sidebarData = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Dashboard",
            url: "/",
            icon: Home,
        },
        {
            title: "Inventory",
            url: "/inventory",
            icon: Bot,
        },
        {
            title: "Notifications",
            url: "/notifications",
            icon: Bell,
        },
        {
            title: "AccessControl",
            url: "/access-control",
            icon: ShieldAlert
        },
        {
            title: "Surveillance",
            url: "/surveillance/",
            icon: Cctv,
            items: [
                {
                    title: "Camera Feed",
                    url: "/surveillance/camera-feed",
                },
                {
                    title: "Sensor Readings",
                    url: "/surveillance/sensor-readings",
                },
            ],
        },
        {
            title: "Settings",
            url: "/settings/",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "/settings/general",
                },
                {
                    title: "Team",
                    url: "/settings/teams",
                },
                {
                    title: "Help & Support",
                    url: "/settings/help",
                },
            ],
        },
    ],
}

export const roleOptions = [
    "ADMIN",
    "WAREHOUSE MANAGER",
    "WAREHOUSE WORKER",
]