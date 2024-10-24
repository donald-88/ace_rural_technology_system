'use server'

import { createTeamMember, deleteTeamMember } from "@/lib/actions/team-actions"
import { TeamMemberParams } from "@/types"

export async function createTeamMemberAction(teamMember: TeamMemberParams) {
    try {
        const newMember = await createTeamMember(teamMember)

        // Check if we got an error message back from createTeamMemberDB
        if ('message' in newMember) {
            return { success: false, error: newMember.message }
        }

        return { success: true, data: newMember }
    } catch (error) {
        console.error("Error creating team member:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create team member"
        }
    }
}

export async function deleteTeamMemberAction(teamMemberId: string) {
    console.log("Deleting team member with ID:", teamMemberId)
    try {
        const deletedMember = await deleteTeamMember(teamMemberId)
        console.log("Deleted member:", deletedMember)

        if ('message' in deletedMember) {
            return { success: false, error: deletedMember.message }
        }

        return { success: true, data: deletedMember }
    } catch (error) {
        console.error("Error deleting team member:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete team member"
        }
    }
}