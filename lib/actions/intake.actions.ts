"use server"


import { db } from "@/db"
import { deposit, type Deposit, type NewDeposit } from "@/db/schema/deposit"
import { warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { weightEntries, type NewWeightEntry } from "@/db/schema/weightEntries"
import { InventoryItemType } from "@/types"
import { desc, eq, inArray, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"

interface DepositFormData {
    id: string,
    warehouseReceiptId: string
    depositorId: string
    costProfile: string
    incomingBags: string
    moisture: string
    weightEntries: Array<{ bagsWeighed: string; grossWeight: string }>
    deductions: string
    netWeight: string
    crnImageUrl?: string
}

/**
 * Generates a unique INK (Intake) ID based on the current date.
 * The ID format is "INK-YYYYMMDD-XXXX" where XXXX is a sequential number.
 * @returns {Promise<string>} The generated INK ID.
 */
export async function generateINKId(): Promise<string> {
    const today = new Date();
    const datePart = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    const prefix = `INK-${datePart}-`;

    const latestRecord = await db
        .select({ id: deposit.id })
        .from(deposit)
        .where(
            sql`${deposit.id} LIKE ${prefix + '%'}` // Use LIKE operator for pattern matching
        )
        .orderBy(desc(deposit.id))
        .limit(1);

    let newCounter = 1;
    if (latestRecord.length > 0) {
        const lastId = latestRecord[0].id;
        const lastCounter = parseInt(lastId.split("-")[2], 10);
        newCounter = lastCounter + 1;
    }

    const newId = `INK-${datePart}-${String(newCounter).padStart(4, "0")}`;
    return newId;
}



/**
 * Creates a new deposit record in the database.
 * @param {DepositFormData} depositDetails - The deposit details to be saved.
 * @returns {Promise<{ id: string }>} The created deposit record.
 */
export const createDeposit = async (depositDetails: DepositFormData): Promise<{ id: string }> => {
    try {
        const newReceipt = await db.insert(deposit)
            .values({
                id: depositDetails.id,
                warehouseReceiptId: depositDetails.warehouseReceiptId,
                depositorId: depositDetails.depositorId,
                costProfile: depositDetails.costProfile,
                incomingBags: Number.parseInt(depositDetails.incomingBags, 10),
                moisture: depositDetails.moisture,
                deductions: depositDetails.deductions,
                netWeight: depositDetails.netWeight,
                crnImageUrl: depositDetails.crnImageUrl,
            } as NewDeposit)
            .returning({ id: deposit.id })

        // Insert the weight entries
        const weightEntriesData: NewWeightEntry[] = depositDetails.weightEntries.map((entry) => ({
            depositId: newReceipt[0].id.toString(),
            bagsWeighed: Number.parseInt(entry.bagsWeighed, 10),
            grossWeight: entry.grossWeight,
        }))

        await db.insert(weightEntries).values(weightEntriesData)

        return JSON.parse(JSON.stringify(newReceipt))
    } catch (error) {
        throw error
    }
}



/**
 * Retrieves the intake data from the database.
 * @returns {Promise<any>} The intake data.
 */
export const getIntake = async (): Promise<InventoryItemType[]> => {
    try {
        const result = await db.select({
            warehouseReceiptNumber: warehouseReceipt.id,
            commodityGroup: warehouseReceipt.commodityGroup,
            commodityVariety: warehouseReceipt.commodityVariety,
            depositId: deposit.id,
            depositorId: deposit.depositorId,
            costProfile: deposit.costProfile,
            incomingBags: deposit.incomingBags,
            moisture: deposit.moisture,
            netWeight: deposit.netWeight,
            createdAt: deposit.createdAt
        }).from(warehouseReceipt).rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        throw error
    }
};




/**
 * Deletes the specified intake items from the database.
 * @param {string[]} inventoryItemIds - The IDs of the intake items to be deleted.
 * @returns {Promise<{ id: string, message?: string }[]>} The result of the delete operation.
 */
export async function deleteIntakeItems(inventoryItemIds: string[]) {
    try {

        await db.delete(deposit).where(inArray(deposit.id, inventoryItemIds))
        revalidatePath("/inventory/intake")
        return {
            success: true
        }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete reports"
        }
    }
}