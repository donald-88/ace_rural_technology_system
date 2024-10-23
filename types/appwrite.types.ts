import { Models } from "node-appwrite"

export interface Inventory extends Models.Document {
    name: string
    price: number
    quantity: number
    category: string
    createdAt: string
    updatedAt: string
    status: string
    tags: string[]
    createdBy: string
    updatedBy: string
    deleted: boolean
}


export interface TeamMember extends Models.Document {
    name: string
    email: string
    phone: string
    role: string
    createdAt: string
    updatedAt: string
}