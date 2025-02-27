export interface TeamMemberType {
    id: string
    name: string
    email: string
    phone: string
    role: 'Admin' | 'Warehouse Manager'
    createdAt: string
}

export type User = {
    id: string;
    email: string;
    emailVerified: boolean
    phone: string;
    name: string;
    role?: string;
    image?: string;
    banned: boolean;
    banReason?: string;
    banExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type ClientType = {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
};

export type WarehouseReceiptType = {
    id: string
    warehouseId: string
    holder: string
    commodityVariety: string
    commodityGroup: string
    grade: string
    currency: string
    cropSeason: string
}

export type WarehouseType = {
    id: string
    name: string
    location: string
    capacity: number
}

export type CommodityTypes = {
    id: string
    variety: string[]
    group: string
}

export type AccessType = {
    userId: string
    deviceId: string
    reason: string
}

export type DeviceInfo = {
    id: string
    deviceId: string
    deviceName: string
    type: string
    batteryLevel: number
    pairedAt: string
    homeId: []
    linkedDevices: []
}