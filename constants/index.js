import {
    Bell,
    Cctv, Home,
    Settings2,
    ShieldAlert,
    User,
    FileSpreadsheet,
    Database,
    Recycle,
    Download,
    Upload,
    Lock,
    Users,
} from "lucide-react"

export const adminSidebarData = {
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
            items: [
                {
                    title: "Intake",
                    url: "/inventory/intake",
                },
                {
                    title: "Handling",
                    url: "/inventory/handling",
                },
                {
                    title: "Dispatch",
                    url: "/inventory/dispatch",
                }
            ]
        },
        {
            title: "Clients",
            url: "/clients",
            icon: User,
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
            icon: FileSpreadsheet
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
                {
                    title: "Playback Footage",
                    url: "/surveillance/recordings",
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

export const warehouseSidebarData = {
    navMain: [
        {
            title: "Intake",
            url: "/warehouse/intake",
            icon: Download,
        },
        {
            title: "Handling",
            url: "/warehouse/handling",
            icon: Recycle,
        },
        {
            title: "Dispatch",
            url: "/warehouse/dispatch",
            icon: Upload
        },
        {
            title: "Surveillance",
            url: "/warehouse/surveillance",
            icon: Cctv
        },
        {
            title: "Clients",
            url: "/warehouse/clients",
            icon: Users,
        },
        {
            title: "Access",
            url: "/warehouse/access",
            icon: Lock
        }
    ],
}

export const roleOptions = [
    "Admin",
    "Manager",
]