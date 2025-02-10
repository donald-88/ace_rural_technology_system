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

export type AccessType = {
    userId: string;
    otp: string;
    deviceId: string;
    reason: string;
    role: "Admin" | "Warehouse Manager";
    status: "Pending" | "Approved" | "Denied";
}

export type RequestType = {
    user_id: string;
    reason: string;
    startDate: Date;
    otp: string;
    device_id: string;
    role: Admin | WarehouseManager,
    status: "pending" | "granted" | "denied"
}

export type ClientType = {
    id: string;
    name: string;
    phone: string;
    address: string;
    accountName: string;
    accountNumber: number;
    bank: string;
    createdAt: Date;
    updatedAt: Date;
};

export type IntakeType = {
    intakeId: string
    clientId: string
    amount: number
    commodity: string
    variety: string
    grade: number
    price: number
    grossWeight: number
    netWeight: number
    deductions: number
    moistureIn: number
    bagIds: string[]
    createdAt: Date
    updatedAt: Date
};

export type HandlingType = {
    handlingId: string;
    intakeId: string;
    commodity: string;
    variety: string;
    grade: number;
    grossWeight: number;
    netWeight: number;
    deductions: number;
    moistureIn: number;
    bagsOut: number;
    bagsIn: number;
    createdAt: string;
    updatedAt: string;
};

export type DispatchType = {
    dispatchId: string
    intakeId: string
    handlingId: string
    amount: number
    commodity: string
    variety: string
    grade: number
    price: number
    grossWeight: number
    netWeight: number
    deductions: number
    moistureIn: number
    bagCount: number
}

export interface BagType {
    _id: string,
    intakeId: string,
    bagNumber: number
}