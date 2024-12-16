'use server'

import { deleteReportItem } from "@/lib/actions/reports.action";
export async function deleteReportItemAction(inventoryItemId: string) {
    try {
        const deletedItem = await deleteReportItem(inventoryItemId)

        if (deletedItem.message === "Error deleting report item") {
            return { success: false, error: deletedItem.message }
        }
        return { success: true, data: deletedItem }
    }
    catch (error) {
        console.error("Error deleting report item:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete report item"
        }
    }
}