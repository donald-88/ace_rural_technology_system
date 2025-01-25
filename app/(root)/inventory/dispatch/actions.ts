'use server'

import { deleteDispatchItem } from "@/lib/actions/dispatch.actions"

export async function deleteDispatchItemAction(inventoryItemIds: string[]) {
    try {
            const deletedItems = await deleteDispatchItem(inventoryItemIds)
            return { success: true, data: deletedItems }
        } catch (error) {
            console.error("Error deleting inventory items:", error)
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to delete inventory items"
            }
        }
}