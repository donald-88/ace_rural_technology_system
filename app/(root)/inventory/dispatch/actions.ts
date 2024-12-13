'use server'

import { deleteDispatchItem } from "@/lib/actions/dispatch.actions"

export async function deleteDispatchItemAction(inventoryItemId: string) {
    try {
        const deletedItem = await deleteDispatchItem(inventoryItemId)

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