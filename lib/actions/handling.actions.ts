"use server"

import { db } from "@/db"
import { handling, type Handling, type NewHandling } from "@/db/schema/handling"
import { warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { NewWeightEntry, weightEntries } from "@/db/schema/weightEntries"
import { and, count, desc, eq, gte, inArray, lte, or, SQL, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { handlingSearchParamsData } from "../validation"

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
    const prefix = `HND-${datePart}-`;

    const latestRecord = await db
        .select({ id: handling.id })
        .from(handling)
        .where(
            sql`${handling.id} LIKE ${prefix + '%'}` // Use LIKE operator for pattern matching
        )
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
export const getHandling = async (input: handlingSearchParamsData): Promise<{ data: Handling[], total: number, pageCount: number }> => {
    const { page, per_page, sort, from, to, operator } = input;
    try {
        // Calculate offset for pagination
        const offset = (page - 1) * per_page

        // Split the sort string to determine column and order
        const [column, order] = (sort?.split(".").filter(Boolean) ?? [
            "createdAt",
            "desc",
        ]) as [keyof Handling | undefined, "asc" | "desc" | undefined]


        // Convert date strings to Date objects for date filtering
        const fromDay = from ? new Date(from) : undefined
        const toDay = to ? new Date(to) : undefined

        const expressions: (SQL<unknown> | undefined)[] = [
            // Apply date range filter if both dates are provided
            fromDay && toDay
                ? and(gte(handling.createdAt, fromDay), lte(handling.createdAt, toDay))
                : undefined,
        ]

        const where = expressions.length > 0
            ? (!operator || operator === "and" ? and(...expressions) : or(...expressions))
            : undefined

        const handlingData = await db.select({
            id: handling.id,
            warehouseReceiptNumber: warehouseReceipt.id,
            commodityGroup: warehouseReceipt.commodityGroup,
            commodityVariety: warehouseReceipt.commodityVariety,
            noOfBags: handling.noOfBags,
            netWeight: handling.netWeight,
            createdAt: handling.createdAt,
        }).from(warehouseReceipt).rightJoin(handling, eq(warehouseReceipt.id, handling.warehouseReceiptId))
            .limit(per_page)
            .offset(offset)
            .where(where)

        const totalRows = await db
            .select({ count: count() })
            .from(warehouseReceipt).rightJoin(handling, eq(warehouseReceipt.id, handling.warehouseReceiptId))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

        return {
            data: JSON.parse(JSON.stringify(handlingData)),
            total: totalRows,
            pageCount: Math.ceil(totalRows / per_page),
        }
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