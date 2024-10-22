import { connectMongoDB } from "@/lib/mongodb"
import { Inventory } from "@/models/intake"

export const createIntake = async () => {
    try {
        await connectMongoDB()

        const intake = await Inventory.create({
            clientName: "John Smith",
            phone: 2659876543,
            commodity: "Maize",
            variety: "Arabica",
            grade: 3,
            priceKg: 1000,
            grossWeight: 50,
            deductions: 10,
            netWeight: 49.9,
            moistureIn: 0.4,
            bagCount: 100,
            incomingBagCount: 100,
            bagsReturned: 0,
            outgoingBags: 0
        })

        intake.save()

        return {
            message: "Intake successful!",
        }
    } catch (error) {
        console.error("Error creating intake:", error)
        return {
            message: "Error creating intake"
        }
    }
}

export const getInventory = async () => {
    try {
        await connectMongoDB()
        const intake = await Inventory.find()
        return intake
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getInventoryById = async (id: string) => {
    try {
        await connectMongoDB()
        const intake = await Inventory.findById(id)
        return intake
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}