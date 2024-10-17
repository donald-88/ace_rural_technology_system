import { connectMongoDB } from "@/lib/mongodb"
import { Inventory } from "@/models/intake"

export const intakeAction = async () => {
    try {
        await connectMongoDB()

        const intake = await Inventory.create({
            intakeId: "79kjgk",
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
            incomingBagCount: 100,
            numberOfBags: 100,
            time: "10:00 AM",
            date: new Date("2023-08-01")
        })

        console.log(intake)

        return {
            message: "Intake successful!",
        }
    } catch (error) {
        console.error("Error creating intake:", error)
        return {
            message: "Error creating intake",
        }
    }
}