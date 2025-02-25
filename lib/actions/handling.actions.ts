"use server"

import { db } from "@/db"
import { handling, type Handling, type NewHandling } from "@/db/schema/handling"
import { warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { NewWeightEntry, weightEntries } from "@/db/schema/weightEntries"
import { desc, eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"

interface HandlingFormData {
    id: string
    warehouseReceiptId: string
    noOfBags: string
    moisture?: string
    weightEntries: Array<{ bagsWeighed: string; grossWeight: string }>
    deductions: string
    netWeight: string
}

/**
 * Generates a unique handling ID based on the current date.
 * @returns {Promise<string>} A new handling ID in the format "HND-YYYYMMDD-XXXX".
 */
export async function generateHNDId(): Promise<string> {
    const today = new Date();
    const datePart = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

    const latestRecord = await db
        .select({ id: handling.id })
        .from(handling)
        .where(eq(handling.id, `HND-${datePart}-%`)) // Filtering today's records
        .orderBy(desc(handling.id))
        .limit(1);

    let newCounter = 1;

    if (latestRecord.length > 0) {
        const lastId = latestRecord[0].id;
        const lastCounter = parseInt(lastId.split("-")[2], 10);
        newCounter = lastCounter + 1;
    }

    const newId = `HND-${datePart}-${String(newCounter).padStart(4, "0")}`;
    return newId;
}



/**
 * Creates a new handling record in the database.
 * @param {HandlingFormData} handlingDetails - The details of the new handling record.
 * @returns {Promise<Handling>} The newly created handling record.
 */
export const createHandling = async (handlingDetails: HandlingFormData): Promise<Handling> => {
    try {
        const newhandling = await db.insert(handling).values({
            id: handlingDetails.id,
            warehouseReceiptId: handlingDetails.warehouseReceiptId,
            noOfBags: Number(handlingDetails.noOfBags),
            deductions: handlingDetails.deductions,
            netWeight: handlingDetails.netWeight,
        } as NewHandling).returning({ id: handling.id })

        const weightEntriesData: NewWeightEntry[] = handlingDetails.weightEntries.map((entry) => ({
            handlingId: newhandling[0].id.toString(),
            bagsWeighed: Number.parseInt(entry.bagsWeighed, 10),
            grossWeight: entry.grossWeight,
        }))

        await db.insert(weightEntries).values(weightEntriesData)

        return JSON.parse(JSON.stringify(newhandling))
    } catch (error) {
        console.error("Error creating intake:", error)
        throw error
    }
}



/**
 * Retrieves a list of handling records from the database, joined with warehouse receipt data.
 * @returns {Promise<Handling[]>} An array of handling records with associated warehouse receipt data.
 */
export const getHandling = async (): Promise<Handling[]> => {
    try {
        const handlingData = await db.select({
            warehouseReceiptNumber: warehouseReceipt.id,
            commodityGroup: warehouseReceipt.commodityGroup,
            commodityVariety: warehouseReceipt.commodityVariety,
            handlingId: handling.id,
            noOfBags: handling.noOfBags,
            netWeight: handling.netWeight,
            createdAt: handling.createdAt,
        }).from(warehouseReceipt).rightJoin(handling, eq(warehouseReceipt.id, handling.warehouseReceiptId))

        return JSON.parse(JSON.stringify(handlingData))
    } catch (error) {
        throw error
    }
}


/**
 * Deletes handling items from the database based on the provided inventory item IDs.
 * @param inventoryItemIds - An array of inventory item IDs to be deleted.
 * @returns An array of objects containing the deleted item ID and an optional success/error message.
 */
export async function deleteHandlingItems(inventoryItemIds: string[]): Promise<{ id: string; message?: string }[]> {
    try {
        await db.delete(handling).where(inArray(handling.id, inventoryItemIds))
        revalidatePath("/inventory/handling")
        return inventoryItemIds.map((id) => ({ id, message: "Deleted successfully" }));
    } catch (error) {
        return inventoryItemIds.map((id) => ({ id, message: "Error deleting inventory item" }));
    }
}