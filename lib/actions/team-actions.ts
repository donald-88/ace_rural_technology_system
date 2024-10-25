"use server"

import { TeamMemberParams } from "@/types"
import { databases, DATABASE_ID, TEAM_COLLECTION_ID } from "../appwrite.config"
import { ID, Query } from "node-appwrite"
import { parseStringify } from "../utils"
import { revalidatePath } from "next/cache"

export const createTeamMember = async (teamMember: TeamMemberParams) => {
    try {
        const newMember = await databases.createDocument(
            DATABASE_ID!,
            TEAM_COLLECTION_ID!,
            ID.unique(),
            {
                ...teamMember
            }
        )
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
        const teamMembers = await databases.listDocuments(
            DATABASE_ID!,
            TEAM_COLLECTION_ID!,
            [Query.orderDesc("$createdAt")]
        )
        const data = await parseStringify(teamMembers.documents)

        return data
    } catch (error) {
        console.error("Error getting team members:", error)
        throw error
    }
}

export const deleteTeamMember = async (teamMemberId: string) => {
    try {
        const deletedMember = await databases.deleteDocument(
            DATABASE_ID!,
            TEAM_COLLECTION_ID!,
            teamMemberId
        )
        
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