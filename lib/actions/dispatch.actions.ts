"use server"

import { db } from "@/db"
import { Dispatch, dispatch, NewDispatch } from "@/db/schema/dispatch"
import { warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { NewWeightEntry, weightEntries } from "@/db/schema/weightEntries"
import { and, count, desc, eq, gte, inArray, lte, or, SQL, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { dispatchSearchParamsData } from "../validation"

interface DispatchFormData {
    id: string
    warehouseReceiptId: string
    drawDownId: string
    noOfBags: string
    weightEntries: Array<{ bagsWeighed: string; grossWeight: string }>
    deductions: string
    netWeight: string
}


/**
 * Generates a unique dispatch ID based on the current date.
 * @returns {Promise<string>} The generated dispatch ID.
 */
export async function generateDPCId(): Promise<string> {
    const today = new Date();
    const datePart = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    const prefix = `DPC-${datePart}-`;

    const latestRecord = await db
        .select({ id: dispatch.id })
        .from(dispatch)
        .where(
            sql`${dispatch.id} LIKE ${prefix + '%'}` // Use LIKE operator for pattern matching
        )
        .orderBy(desc(dispatch.id))
        .limit(1);

    let newCounter = 1;
    if (latestRecord.length > 0) {
        const lastId = latestRecord[0].id;
        const lastCounter = parseInt(lastId.split("-")[2], 10);
        newCounter = lastCounter + 1;
    }

    const newId = `DPC-${datePart}-${String(newCounter).padStart(4, "0")}`;
    return newId;
}



/**
 * Creates a new dispatch record in the database.
 * @param {DispatchFormData} dispatchDetails - The dispatch details to be saved.
 * @returns {Promise<{ id: string }>} The created dispatch record.
 */
export const createDispatch = async (dispatchDetails: DispatchFormData): Promise<{ id: string }> => {
    try {
        const newdispatch = await db.insert(dispatch).values({
            id: dispatchDetails.id,
            warehouseReceiptId: dispatchDetails.warehouseReceiptId,
            drawDownId: dispatchDetails.drawDownId,
            noOfBags: Number(dispatchDetails.noOfBags),
            netWeight: dispatchDetails.netWeight,
        } as NewDispatch).returning({ id: dispatch.id })

        const weightEntriesData: NewWeightEntry[] = dispatchDetails.weightEntries.map((entry) => ({
            dispatchId: newdispatch[0].id.toString(),
            bagsWeighed: Number.parseInt(entry.bagsWeighed, 10),
            grossWeight: entry.grossWeight,
        }))

        await db.insert(weightEntries).values(weightEntriesData)
        return JSON.parse(JSON.stringify(newdispatch))
    } catch (error) {
        console.error("Error creating dispatch:", error)
        throw error
    }
}



/**
 * Retrieves dispatch data from the database.
 * @returns {Promise<{ warehouseReceiptNumber: string; commodityGroup: string; commodityVariety: string; drawdownId: string; dispatchId: string; noOfBags: number; netWeight: string; createdAt: Date }[]>} The dispatch data.
 */
export const getDispatch = async (input: dispatchSearchParamsData): Promise<{ data: Dispatch[], total: number, pageCount: number }> => {
    const { page, per_page, sort, from, to, operator } = input;
    try {
        // Calculate offset for pagination
        const offset = (page - 1) * per_page

        // Split the sort string to determine column and order
        const [column, order] = (sort?.split(".").filter(Boolean) ?? [
            "createdAt",
            "desc",
        ]) as [keyof Dispatch | undefined, "asc" | "desc" | undefined]


        // Convert date strings to Date objects for date filtering
        const fromDay = from ? new Date(from) : undefined
        const toDay = to ? new Date(to) : undefined

        const expressions: (SQL<unknown> | undefined)[] = [
            // Apply date range filter if both dates are provided
            fromDay && toDay
                ? and(gte(dispatch.createdAt, fromDay), lte(dispatch.createdAt, toDay))
                : undefined,
        ]

        const where = expressions.length > 0
            ? (!operator || operator === "and" ? and(...expressions) : or(...expressions))
            : undefined

        const dispatchData = await db.select({
            id: dispatch.id,
            warehouseReceiptNumber: warehouseReceipt.id,
            commodityGroup: warehouseReceipt.commodityGroup,
            commodityVariety: warehouseReceipt.commodityVariety,
            drawdownId: dispatch.drawDownId,
            noOfBags: dispatch.noOfBags,
            netWeight: dispatch.netWeight,
            createdAt: dispatch.createdAt,
        }
        ).from(warehouseReceipt).rightJoin(dispatch, eq(warehouseReceipt.id, dispatch.warehouseReceiptId))
            .limit(per_page)
            .offset(offset)
            .where(where)

        const totalRows = await db
            .select({ count: count() })
            .from(warehouseReceipt).rightJoin(dispatch, eq(warehouseReceipt.id, dispatch.warehouseReceiptId))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)


        return {
            data: JSON.parse(JSON.stringify(dispatchData)),
            total: totalRows,
            pageCount: Math.ceil(totalRows / per_page),
        }
    }
    catch (error) {
        console.error("Error fetching dispatch:", error)
        throw error
    }
}


/**
 * Deletes dispatch items from the database.
 * @param {string[]} inventoryItemIds - The IDs of the dispatch items to be deleted.
 * @returns {Promise<{ id: string; message?: string }[]>} The result of the delete operation for each item.
 */
export async function deleteDispatchItems(inventoryItemIds: string[]): Promise<{ id: string; message?: string }[]> {
    try {
        await db.delete(dispatch).where(inArray(dispatch.id, inventoryItemIds))
        revalidatePath("/inventory/dispatch")
        return inventoryItemIds.map((id) => ({ id, message: "Deleted successfully" }));
    } catch (error) {
        return inventoryItemIds.map((id) => ({ id, message: "Error deleting inventory item" }));
    }
}