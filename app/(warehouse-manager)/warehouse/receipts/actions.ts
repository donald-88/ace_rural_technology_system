'use server'

import { createReceipt, deleteReceipt, generateWHRId } from "@/lib/actions/receipt.actions"
import { type receiptFormData, receiptFormSchema } from "@/lib/validation"

export async function createReceiptAction(formData: receiptFormData) {
    try {
        const validatedData = receiptFormSchema.safeParse(formData)
        if (!validatedData.success) {
            return {
                status: "error",
                message: validatedData.error.message
            }
        }

        const whrId = await generateWHRId()

        const result = await createReceipt({
            id: whrId,
            holder: validatedData.data.holder,
            commodityVariety: validatedData.data.commodityVariety,
            commodityGroup: validatedData.data.commodityGroup,
            grade: validatedData.data.grade,
            warehouse_id: validatedData.data.warehouseId,
            currency: validatedData.data.currency,
            cropSeason: validatedData.data.cropSeason,
        })

        if (!result) {
            return {
                status: "error",
                message: "An error occurred while creating the receipt."
            }
        }

        return {
            status: "success",
            message: "Warehouse Receipt created successfully.",
        }
    } catch (error) {
        return {
            status: "error",
            message: "An error occurred while creating the receipt."
        }
    }
}

export async function deleteReceiptsAction(receiptIds: string[]) {
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