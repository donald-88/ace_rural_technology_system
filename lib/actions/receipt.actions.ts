"use server"

import { db } from "@/db"
import { warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type NewWarehouseReceipt = typeof warehouseReceipt.$inferInsert;

export const createReceipt = async (receiptDetails: NewWarehouseReceipt) => {
    const warehouseReceiptId = `WH${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const receipt = await db.insert(warehouseReceipt).values({
        id: warehouseReceiptId,
        warehouse_id: receiptDetails.warehouse_id,
        holder: receiptDetails.holder,
        commodityVariety: receiptDetails.commodityVariety,
        commodityGroup: receiptDetails.commodityGroup,
        grade: receiptDetails.grade,
        currency: receiptDetails.currency,
        cropSeason: receiptDetails.cropSeason,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).returning()
    return JSON.parse(JSON.stringify(receipt))
}

export const getReceipts = async () => {
    const receipts = await db.select().from(warehouseReceipt)
    return JSON.parse(JSON.stringify(receipts))
}

export const getReceipt = async (receiptId: string) => {
    const receipt = await db.select().from(warehouseReceipt).where(eq(warehouseReceipt.id, receiptId))
    return JSON.parse(JSON.stringify(receipt))
}

export const deleteReceipt = async (receiptId: string[]) => {
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
