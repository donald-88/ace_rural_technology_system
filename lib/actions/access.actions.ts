"use server"

import { revalidatePath } from "next/cache"
import { RequestType } from "@/types"
import AccessModel from "@/models/access"
import connectDB from "../mongodb"

export const getAccessLogs = async () => {
    try {
        await connectDB()
        const access_data = await AccessModel.find({})
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
        await connectDB()
        const requestActionFound = await AccessModel.findOne(requestData)
        if(requestActionFound){
            return {
                success: false,
                message: "Request already sent"
            }
        }

        const requestAction = await AccessModel.create(requestData)
        requestAction.save()

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