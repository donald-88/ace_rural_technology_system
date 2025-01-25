'use server'

import { deleteHandlingItem } from "@/lib/actions/handling.actions"

export async function deleteHandlingItemAction(inventoryItemIds: string[]) {
    try {
        const deletedItems = await deleteHandlingItem(inventoryItemIds)
        return { success: true, data: deletedItems }
    } catch (error) {
        console.error("Error deleting inventory items:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete inventory items"
        }
    }
}