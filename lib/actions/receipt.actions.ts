"use server"

import { db } from "@/db"
import { NewWarehouseReceipt, warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const createReceipt = async (receiptDetails: NewWarehouseReceipt) => {
    const receipt = await db.insert(warehouseReceipt).values({
        warehouse_id: receiptDetails.warehouse_id,
        holder: receiptDetails.holder,
        commodityVariety: receiptDetails.commodityVariety,
        commodityGroup: receiptDetails.commodityGroup,
        grade: receiptDetails.grade,
        currency: receiptDetails.currency,
        cropSeason: receiptDetails.cropSeason
    }).returning()
    return JSON.parse(JSON.stringify(receipt))
}

export const getReceipts = async () => {
    const receipts = await db.select().from(warehouseReceipt)
    return JSON.parse(JSON.stringify(receipts))
}

export const getReceipt = async (receiptId: number) => {
    const receipt = await db.select().from(warehouseReceipt).where(eq(warehouseReceipt.id, receiptId))
    return JSON.parse(JSON.stringify(receipt))
}

export const deleteReceipt = async (receiptId: number[]) => {
    try {
        await db.delete(warehouseReceipt).where(inArray(warehouseReceipt.id, receiptId))
        console.log("Receipt deleted successfully");
        revalidatePath("/warehouse/receipts")
    } catch (error) {
        console.log("Error deleting receipt:", error);
        return {
            message: "Error deleting receipt",
            error: error instanceof Error ? error.message : String(error)
        }
    }
}
