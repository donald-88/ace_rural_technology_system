'use server'

import { deleteIntakeItem } from "@/lib/actions/intake.actions"

export async function deleteIntakeItemAction(inventoryItemId: string) {
    try {
        const deletedItem = await deleteIntakeItem(inventoryItemId)

        if (deletedItem.message === "Error deleting inventory item") {
            return { success: false, error: deletedItem.message }
        }
        return { success: true, data: deletedItem }
    }
    catch (error) {
        console.error("Error deleting inventory item:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete inventory item"
        }
    }
}