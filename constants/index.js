import {
    AudioWaveform,
    Bell,
    Command,
    Cctv, Home,
    GalleryVerticalEnd,
    Settings2,
    ShieldAlert,
    Database,
    DocumentText
} from "lucide-react"

export const sidebarData = {
    user: {
        name: "sophie",
        email: "sophiebanda@gmail.com",
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
            icon: Database,
        },
        {
            title: "Notifications",
            url: "/notifications",
            icon: Bell,
        },
        {
            title: "AccessLogs",
            url: "/access-logs",
            icon: ShieldAlert
        },
        {
            title: "Reports",
            url: "/reports",
            icon: DocumentText
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
                    title: "Teams",
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
    "Admin",
    "WarehouseManager",
    "WarehouseAttendant",
    "MarketingCommittee",
    "Aganyu"

]