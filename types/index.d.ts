export interface TeamMemberParams {
    name: string
    email: string
    phone: string
    role: Admin | WarehouseManager | WarehouseAttendant | MarketingCommittee | Aganyu
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