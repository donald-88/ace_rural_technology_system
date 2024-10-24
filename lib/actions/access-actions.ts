"use server"

import { ACCESS_COLLECTION_ID, databases, DATABASE_ID } from "../appwrite.config"
import { Query } from "node-appwrite"
import { parseStringify } from "../utils"

export const getAccessLogs = async () => {
    try {
        const accessLogs = await databases.listDocuments(
            DATABASE_ID!,
            ACCESS_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        )
        return parseStringify(accessLogs.documents)
    } catch (error) {
        console.error("Error getting access logs:", error)
        return {
            message: "Error getting access logs",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}