"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "../mongodbClient"

export const getAccessLogs = async () => {
    try {

        const client = await clientPromise

        const db = client.db("ace_rural_technology_system")

        const access = db.collection("access_logs")
        const access_data = await access.find({}).toArray()

        revalidatePath("/access-control")
        return access_data
    } catch (error) {
        console.error("Error getting access logs:", error)
        return {
            message: "Error getting access logs",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}