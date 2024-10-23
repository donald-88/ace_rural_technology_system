// app/actions/team-actions.ts
'use server'

import { createTeamMember } from "@/lib/actions/team-actions"
import { TeamMemberParams } from "@/types"

export async function createTeamMemberAction(teamMember: TeamMemberParams) {
    try {
        const newMember = await createTeamMember(teamMember)
        return { success: true, data: newMember }
    } catch (error) {
        console.error("Error creating team member:", error)
        return { success: false, error: "Failed to create team member" }
    }
}