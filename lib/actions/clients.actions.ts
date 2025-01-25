'use server'

import Client from "@/models/clients"
import connectDB from "../mongodb"

export const getClients = async () => {
    try {
        await connectDB()
        const clients = await Client.find({})
        return JSON.parse(JSON.stringify(clients))
    } catch (error) {
        console.error("Error getting clients:", error)
        return {
            message: "Error getting clients",
        }
    }
}

export const getClientById = async (id: string) => {
    try {
        await connectDB()
        const clientDetails = await Client.findOne({ customer_id: id })

        return JSON.parse(JSON.stringify(clientDetails))
    } catch (error) {
        console.error("Error getting client details:", error)
        return {
            message: "Error getting client details",
        }
    }
}