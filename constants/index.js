import {
    AudioWaveform,
    Bell,
    Command,
    Cctv, Home,
    GalleryVerticalEnd,
    Settings2,
    ShieldAlert,
    User,
    Database,
    ArrowUpDown,
    LogOut,
    LogIn,
    LockIcon,
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
            items: [
                {
                    title: "Intake",
                    url: "/inventory/intake",
                },
                {
                    title: "handling",
                    url: "/inventory/handling",
                },
                {
                    title: "Dispatch",
                    url: "/inventory/dispatch",
                }
            ]
        },
        {
            title: "Customers",
            url: "/customers",
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

export const warehouseSidebarData = {
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
            title: "Intake",
            url: "/warehouse-intake",
            icon: LogIn,
        },
        {
            title: "Handling",
            url: "/warehouse-handling",
            icon: ArrowUpDown,
        },
        {
            title: "Dispatch",
            url: "/warehouse-dispatch",
            icon: LogOut
        },
        {
            title: "Request access",
            url: "/warehouse-access",
            icon: LockIcon
        }
    ],
}

export const roleOptions = [
    "Admin",
    "WarehouseManager",
    "WarehouseAttendant",
    "MarketingCommittee",
    "Aganyu"

]