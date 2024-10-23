import { ACCESS_COLLECTION_ID, database, DATABASE_ID } from "../appwrite.config"
import { Query } from "node-appwrite"

export const getAccessLogs = async () => {
    try {
        const accessLogs = await database.listDocuments(
            DATABASE_ID!,
            ACCESS_COLLECTION_ID!,
            // Add these parameters to help debug
            [Query.limit(100), Query.offset(0)],
        )
        // Log more details
        console.log('Total documents:', accessLogs.total)
        console.log('First document:', accessLogs.documents[0])
        return accessLogs.documents
    } catch (error) {
        console.error("Error getting access logs:", error)
        return {
            message: "Error getting access logs",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}