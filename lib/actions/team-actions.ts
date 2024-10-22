import TeamMembers from "@/models/team"
import { connectMongoDB } from "../mongodb"

export const createTeamMember = async () => {
    try {
        await connectMongoDB()

        const user = await TeamMembers.create({
            name: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            role: "ADMIN"
        })

        user.save()
    } catch (error) {
        console.error("Error creating intake:", error)
        return {
            message: "Error creating intake",
        }
    }
}

export const getTeamMembers = async () => {
    try {
        await connectMongoDB()
        const users = await TeamMembers.find()
        return users
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}