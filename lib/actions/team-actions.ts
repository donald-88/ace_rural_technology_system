import { TeamMemberParams } from "@/types"
import { database, DATABASE_ID, TEAM_COLLECTION_ID } from "../appwrite.config"
import { ID, Query } from "node-appwrite"

export const createTeamMember = async (teamMember: TeamMemberParams) => {
    try {
        const newMember = await database.createDocument(
            DATABASE_ID!,
            TEAM_COLLECTION_ID!,
            ID.unique(),
            teamMember,
        )

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
        const teamMembers = await database.listDocuments(
            DATABASE_ID!,
            TEAM_COLLECTION_ID!,
            [
                Query.limit(100),

            ]
        )

        // Add some basic validation
        if (!teamMembers.documents.length) {
            console.log('No team members found')
            return []
        }

        return teamMembers.documents
    } catch (error) {
        console.error("Error getting team members:", error)
        throw error  // Or handle it according to your error handling strategy
    }
}