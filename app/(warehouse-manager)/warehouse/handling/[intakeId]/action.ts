'use server'

import { createHandling } from "@/lib/actions/handling.actions";
import { HandlingType } from "@/types";

export async function createHandlingAction(previousState: any, formData: FormData) {
    try {
        console.log(formData)
        const newIntake = await createHandling(formData as unknown as HandlingType)
        if (newIntake.message === "Error creating intake") {
            return { success: false, error: newIntake.message }
        }
        return { success: true, data: newIntake }
    }
    catch (error) {
        console.error("Error creating intake:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create intake"
        }
    }
}