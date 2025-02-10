"use server"

import { TeamMemberType } from "@/types"
import User from "@/models/user"
import connectDB from "../mongodb"

export const createTeamMember = async (teamMember: TeamMemberType) => {
    try {
        await connectDB()

        const teamMemberFound = await User.findOne({ email: teamMember.email })
        if (teamMemberFound) {
            return {
                message: "Team member already exists"
            }
        }
        const newMember = await User.create(teamMember)
        return newMember
    } catch (error) {
        console.error("Error creating team member:", error)
        return {
            message: "Error creating team member",
        }
    }
}

export const getTeam = async () => {
    try {
        await connectDB()
        const teamMembers = await User.find({})
        return JSON.parse(JSON.stringify(teamMembers))
    } catch (error) {
        console.error("Error getting team members:", error)
        throw error
    }
}

export const deleteTeamMember = async (teamMemberId: string) => {
    try {
        await connectDB()
        await User.deleteOne({ id: teamMemberId })
        return {
            message: "Team member deleted successfully",
        }
    } catch (error) {
        console.error("Error deleting team member:", error)
        return {
            message: "Error deleting team member",
        }
    }
}