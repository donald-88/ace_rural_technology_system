import { ClientType, CommodityTypes, WarehouseType } from "@/types"
import {
    Bell,
    Cctv, Home,
    Settings2,
    ShieldAlert,
    FileSpreadsheet,
    Database,
    Recycle,
    Download,
    Upload,
    Lock,
    Users,
    ReceiptText,
} from "lucide-react"

export const adminSidebarData = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
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
            title: "Receipts",
            url: "/warehouse/receipts",
            icon: ReceiptText,
        },
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

export const MOCK_USERS: ClientType[] = [
    {
        id: 'CL00002435',
        name: "Chimwemwe Banda",
        email: "chimwemwe@example.com",
        phone: "+265888123456",
        address: "Area 47, Lilongwe"
    },
    {
        id: 'CL00002436',
        name: "Thandie Phiri",
        email: "thandie@example.com",
        phone: "+265999234567",
        address: "Nyambadwe, Blantyre"
    },
    {
        id: 'CL00002437',
        name: "Kondwani Mhango",
        email: "kondwani@example.com",
        phone: "+265991345678",
        address: "Area 25, Lilongwe"
    },
    {
        id: 'CL00002438',
        name: "Mwamba Banda",
        email: "mwamba@example.com",
        phone: "+265882456789",
        address: "Area 10, Blantyre"
    },
    {
        id: 'CL00002439',
        name: "Chilufya Mwale",
        email: "chilufya@example.com",
        phone: "+265993567890",
        address: "Area 30, Lilongwe"
    },
    {
        id: 'CL00002440',
        name: "Nkhoma Banda",
        email: "nkhoma@example.com",
        phone: "+265884678901",
        address: "Area 15, Blantyre"
    },
    {
        id: 'CL00002441',
        name: "Chisomo Banda",
        email: "chisomo@example.com",
        phone: "+265995789012",
        address: "Area 20, Lilongwe"
    },
    {
        id: 'CL00002442',
        name: "Chikondi Msowoya",
        email: "chikondi@example.com",
        phone: "+265886890123",
        address: "Area 5, Blantyre"
    },
    {
        id: 'CL00002443',
        name: "Chilongo Phiri",
        email: "chilongo@example.com",
        phone: "+265997901234",
        address: "Area 18, Lilongwe"
    },
    {
        id: 'CL00002444',
        name: "Chitete Fumulani",
        email: "chitete@example.com",
        phone: "+265888012345",
        address: "Area 22, Blantyre"
    }
]

export const MOCK_WAREHOUSES: WarehouseType[] = [
    {
        id: 'WH00002435',
        name: "Lilongwe Warehouse",
        location: "Area 47, Lilongwe",
        capacity: 10000,
    },
    {
        id: 'WH00002436',
        name: "Blantyre Warehouse",
        location: "Area 25, Blantyre",
        capacity: 8000,
    },
    {
        id: 'WH00002437',
        name: "Mzuzu Warehouse",
        location: "Area 10, Mzuzu",
        capacity: 5000,
    },
    {
        id: 'WH00002438',
        name: "Zomba Warehouse",
        location: "Area 15, Zomba",
        capacity: 6000,
    },
    {
        id: 'WH00002439',
        name: "Kasungu Warehouse",
        location: "Area 20, Kasungu",
        capacity: 7000,
    },
    {
        id: 'WH00002440',
        name: "Mangochi Warehouse",
        location: "Area 25, Mangochi",
        capacity: 4000,
    }
]

export const MOCK_COMMODITIES: CommodityTypes[] = [
    {
        id: 'CO00002435',
        variety: [
            "Chitonga",
            "Kanjerenjere",
            "Hickory King",
            "Obatanpa"
        ],
        group: 'Maize'
    },
    {
        id: 'RCE0002436',
        variety: [
            "Kachere",
            "Mbeya 2",
            "Nyala",
            "Muthimba",
            "WAB 56-50",
            "IR 64",
            "Basmati",
            "Nerica",
            "TXD 85",
            "Kona"
        ],
        group: 'Rice'
    },
    {
        id: 'GDN0002437',
        variety: [
            "CG 7",
            "Nsinjiro",
            "Chalimbana",
            "Chalimbana 2000",
            "Chitala",
            "Baka",
            "Nkotama",
            "Kakoma",
            "JL 24",
            "ICGV-SM 90704"
        ],
        group: 'Groundnuts'
    }
]

export const MOCK_GRADE: string[] = [
    "ACE 1",
    "ACE 2",
    "ACE 3",
    "ACE 4",
]

export const MOCK_SEASONS: string[] = [
    "2023/2024",
    "2024/2025",
    "2025/2026",
]