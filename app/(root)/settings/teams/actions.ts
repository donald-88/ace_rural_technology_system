'use server'

import { createTeamMember } from "@/lib/actions/team-actions"
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