export interface TeamMemberParams {
    name: string
    email: string
    phone: string
    role: Admin | WarehouseManager
}

export interface CustomerParams {
    name: string
    email: string
    phone: string
    address: string
    accountName: string
    accountNumber: number
    bank: string
}

export type IntakeType = {
    id: string;
    client_ids: string[];
    commodity: string;
    variety: string;
    grade: number;
    price: number;
    grossWeight: number;
    deductions: number;
    netWeight: number;
    moistureIn: number;
    incomingBagCount: number;
    numberOfBags: number;
    bags: string[];
    time: string;
    date: string;
};

export type RequestType = {
    user_id: string;
    reason: string;
    startDate: Date;
    otp: string;
    device_id: string;
    role: Admin | WarehouseManager,
    status: "pending" | "granted" | "denied"
}

export interface IntakeParams {
    clientName: string,
    phone: number,
    address: string,
    bank: string,
    accountName: string,
    accountNumber: number,
    amount: number,
    commodity: string,
    variety: string,
    grade: number,
    price: number,
    grossWeight: number,
    netWeight: number,
    deductions: number,
    moistureIn: number,
    numberOfBags: number,
    bagsReturned: number
    status: string
}

export interface BagType {
    _id: string,
    intakeId: string,
    bagNumber: number
}