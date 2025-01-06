"use server"

import { revalidatePath } from "next/cache"
import clientPromise from "../mongodbClient"
import { TeamMemberParams } from "@/types"

export const createTeamMember = async (teamMember: TeamMemberParams) => {
    try {
        const client = await clientPromise

        const db = client.db('ace_rural_technology_system')
        const teamCollection = db.collection('users')

        const newMember = await teamCollection.insertOne(teamMember)


        revalidatePath("/settings/team")
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
        const client = await clientPromise
        const db = client.db('ace_rural_technology_system')
        const teamCollection = db.collection('users')
        const teamMembers = await teamCollection.find({}).toArray()

        revalidatePath("/settings/teams")
        return teamMembers
    } catch (error) {
        console.error("Error getting team members:", error)
        throw error
    }
}

export const deleteTeamMember = async (teamMemberId: string) => {
    try {

        const client = await clientPromise
        const db = client.db('ace_rural_technology_system')
        const teamCollection = db.collection('users')
        const deletedMember = await teamCollection.deleteOne({ id: teamMemberId })

        revalidatePath("/settings/team")
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