"use server"

import { Query } from "node-appwrite"
import { databases, DATABASE_ID, INVENTORY_COLLECTION_ID } from "../appwrite.config"
import { parseStringify } from "../utils"
import { revalidatePath } from "next/cache"

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
        const intake = await databases.listDocuments(
            DATABASE_ID!,
            INVENTORY_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        )
        revalidatePath("/inventory")
        return parseStringify(intake.documents)

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

export const deleteInventoryItem = async (intakeId: string) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID!,
            INVENTORY_COLLECTION_ID!,
            intakeId
        )
        revalidatePath("/inventory")
        return {
            message: "Intake deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting intake:", error)
        return {
            message: "Error deleting intake",
        }
    }
}