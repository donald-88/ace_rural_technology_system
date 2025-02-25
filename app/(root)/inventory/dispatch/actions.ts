'use server'

import { deleteDispatchItems } from "@/lib/actions/dispatch.actions"

export async function deleteDispatchItemAction(inventoryItemIds: string[]) {
    try {
        const deletedItems = await deleteDispatchItems(inventoryItemIds)
        return { success: true, data: deletedItems }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete inventory items"
        }
    }
}