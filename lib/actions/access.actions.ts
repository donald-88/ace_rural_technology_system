"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "../mongodbClient"
import { RequestType } from "@/types"

export const getAccessLogs = async () => {
    try {

        const client = await clientPromise

        const db = client.db("ace_rural_technology_system")

        const access = db.collection("access_logs")
        const access_data = await access.find({}).toArray()

        revalidatePath("/access-control")
        return JSON.parse(JSON.stringify(access_data))
    } catch (error) {
        console.error("Error getting access logs:", error)
        return {
            message: "Error getting access logs",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}

export const sendRequestAction = async (requestData: RequestType) => {
    try {
        const client = await clientPromise

        const db = client.db("ace_rural_technology_system")
        const access = db.collection("access_logs")

        await access.insertOne(requestData)

        revalidatePath("/access-control")
        return {
            success: true,
            message: "Request sent successfully"
        }
    } catch (error) {
        console.error("Error sending request:", error)
        return {
            success: false,
            message: "Error sending request",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}