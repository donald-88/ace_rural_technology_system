'use server'

// import { deleteIntakeItems } from "@/lib/actions/intake.actions"

export async function deleteIntakeItemsAction(inventoryItemIds: string[]) {
    try {
        console.log("Deleting inventory items:", inventoryItemIds)
        // const deletedItems = await deleteIntakeItems(inventoryItemIds)
        return { success: true, }
    } catch (error) {
        console.error("Error deleting inventory items:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete inventory items"
        }
    }
}