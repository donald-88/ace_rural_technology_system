'use server'

import { deleteReceipt } from "@/lib/actions/receipt.actions"

export async function deleteReceiptsAction(receiptIds: number[]) {
    try {
        console.log("Deleting receipt(s):", receiptIds)
        const deletedItems = await deleteReceipt(receiptIds)
        return { success: true, data: deletedItems }
    } catch (error) {
        console.error("Error deleting receipt(s):", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete receipt(s)"
        }
    }
}