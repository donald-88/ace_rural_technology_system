import { Query } from "node-appwrite"
import { database, DATABASE_ID, INVENTORY_COLLECTION_ID } from "../appwrite.config"

export const createIntake = async () => {
    try {
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
        const intake = await database.listDocuments(
            DATABASE_ID!,
            INVENTORY_COLLECTION_ID!,
            [Query.limit(1000), Query.offset(0) , Query.orderDesc("$createdAt")]
        )

        console.log(intake)
        return intake.documents

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getInventoryById = async () => {
    try {
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}