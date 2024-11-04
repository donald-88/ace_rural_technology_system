'use server'

import { createTeamMember, deleteTeamMember } from "@/lib/actions/team.actions"
import { TeamMemberParams } from "@/types"

export async function createTeamMemberAction(teamMember: TeamMemberParams) {
    try {
        const newMember = await createTeamMember(teamMember)

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
    try {
        const deletedMember = await deleteTeamMember(teamMemberId)

        if (deletedMember.message === "Error deleting team member") {
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