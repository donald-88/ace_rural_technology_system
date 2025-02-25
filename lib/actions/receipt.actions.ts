"use server"

import { db } from "@/db"
import { warehouseReceipt, type NewWarehouseReceipt, type WarehouseReceipt } from "@/db/schema/warehouse-receipt"
import { desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";



/**
 * Generates a unique warehouse receipt ID based on the current date.
 * The ID format is "WHR-YYYYMMDD-XXXX", where XXXX is a sequential number.
 * @returns {Promise<string>} The generated warehouse receipt ID.
 */
export async function generateWHRId(): Promise<string> {
    const today = new Date();
    const datePart = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

    const latestRecord = await db
        .select({ id: warehouseReceipt.id })
        .from(warehouseReceipt)
        .where(eq(warehouseReceipt.id, `WHR-${datePart}-%`)) // Filtering today's records
        .orderBy(desc(warehouseReceipt.id))
        .limit(1);

    let newCounter = 1;

    if (latestRecord.length > 0) {
        const lastId = latestRecord[0].id;
        const lastCounter = parseInt(lastId.split("-")[2], 10);
        newCounter = lastCounter + 1;
    }

    const newId = `WHR-${datePart}-${String(newCounter).padStart(4, "0")}`;
    return newId;
}


/**
 * Creates a new warehouse receipt in the database.
 * @param {NewWarehouseReceipt} receiptDetails - The details of the new warehouse receipt.
 * @returns {Promise<WarehouseReceipt>} The created warehouse receipt.
 */
export const createReceipt = async (receiptDetails: NewWarehouseReceipt): Promise<WarehouseReceipt> => {
    try {
        const receipt = await db.insert(warehouseReceipt).values({
            id: receiptDetails.id,
            warehouse_id: receiptDetails.warehouse_id,
            holder: receiptDetails.holder,
            commodityVariety: receiptDetails.commodityVariety,
            commodityGroup: receiptDetails.commodityGroup,
            grade: receiptDetails.grade,
            currency: receiptDetails.currency,
            cropSeason: receiptDetails.cropSeason
        }).returning()

        revalidatePath("/warehouse/receipts")
        return JSON.parse(JSON.stringify(receipt))
    } catch (error) {
        throw error
    }
}


/**
 * Retrieves all warehouse receipts from the database.
 * @returns {Promise<WarehouseReceipt[]>} An array of all warehouse receipts.
 */
export const getReceipts = async (): Promise<WarehouseReceipt[]> => {
    try {
        const receipts = await db.select().from(warehouseReceipt)
        return JSON.parse(JSON.stringify(receipts))
    } catch (error) {
        throw error
    }
}


/**
 * Retrieves a specific warehouse receipt from the database.
 * @param {number} receiptId - The ID of the warehouse receipt to retrieve.
 * @returns {Promise<WarehouseReceipt>} The retrieved warehouse receipt.
 */
export const getReceipt = async (receiptId: number): Promise<WarehouseReceipt> => {
    try {
        const receipt = await db.select().from(warehouseReceipt).where(eq(warehouseReceipt.id, receiptId.toString()))
        return JSON.parse(JSON.stringify(receipt))
    } catch (error) {
        throw error
    }
}


/**
 * Deletes one or more warehouse receipts from the database.
 * @param {string[]} receiptId - An array of warehouse receipt IDs to delete.
 * @returns {Promise<void>} A promise that resolves when the receipts have been deleted.
 */
export const deleteReceipt = async (receiptId: string[]): Promise<void> => {
    try {
        await db.delete(warehouseReceipt).where(inArray(warehouseReceipt.id, receiptId))
        revalidatePath("/warehouse/receipts")
    } catch (error) {
        throw error
    }
}
