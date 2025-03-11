"use server"

import { db } from "@/db"
import { warehouseReceipt, type NewWarehouseReceipt, type WarehouseReceipt } from "@/db/schema/warehouse-receipt"
import { and, count, desc, eq, inArray, or, SQL, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { receiptSearchParamsData } from "../validation";
import { filterColumn } from "../filter-column";



/**
 * Generates a unique warehouse receipt ID based on the current date.
 * The ID format is "WHR-YYYYMMDD-XXXX", where XXXX is a sequential number.
 * @returns {Promise<string>} The generated warehouse receipt ID.
 */
export async function generateWHRId(): Promise<string> {
    const today = new Date();
    const datePart = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
    const prefix = `WHR-${datePart}-`;

    const latestRecord = await db
        .select({ id: warehouseReceipt.id })
        .from(warehouseReceipt)
        .where(
            sql`${warehouseReceipt.id} LIKE ${prefix + '%'}` // Use LIKE operator for pattern matching
        )
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
export const getReceipts = async (input: receiptSearchParamsData) => {
    const { page, per_page, sort, id, warehouseId, holder, commodityGroup, commodityVariety, from, to, operator } = input
    try {
        // Calculate offset for pagination
        const offset = (page - 1) * per_page

        // Split the sort string to determine column and order
        const [column, order] = (sort?.split(".").filter(Boolean) ?? [
            "createdAt",
            "desc",
        ]) as [keyof WarehouseReceipt | undefined, "asc" | "desc" | undefined]

        // Convert date strings to Date objects for date filtering
        const fromDay = from ? new Date(from) : undefined
        const toDay = to ? new Date(to) : undefined

        const expressions: (SQL<unknown> | undefined)[] = [
            // Apply ID filter if provided
            id
                ? filterColumn({
                    column: warehouseReceipt.id,
                    value: id,
                })
                : undefined,

            // Apply warehouseId filter if provided
            warehouseId
                ? filterColumn({
                    column: warehouseReceipt.warehouse_id,
                    value: warehouseId,
                })
                : undefined,
            // Apply holder filter if provided
            holder
                ? filterColumn({
                    column: warehouseReceipt.holder,
                    value: holder,
                })
                : undefined,

            // Apply commodityGroup filter if provided
            commodityGroup
                ? filterColumn({
                    column: warehouseReceipt.commodityGroup,
                    value: commodityGroup,
                })
                : undefined,

            // Apply commodityVariety filter if provided
            commodityVariety
                ? filterColumn({
                    column: warehouseReceipt.commodityVariety,
                    value: commodityVariety,
                })
                : undefined,
        ]

        // Combine filters using "and" or "or" based on the operator
        const where = expressions.length > 0
            ? (!operator || operator === "and" ? and(...expressions) : or(...expressions))
            : undefined


        const receipts = await db.select().from(warehouseReceipt)
            .where(where)
            .limit(per_page)
            .offset(offset)

        const totalRows = await db
            .select({ count: count() })
            .from(warehouseReceipt)
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

        return {
            data: JSON.parse(JSON.stringify(receipts)),
            total: totalRows,
            pageCount: Math.ceil(totalRows / per_page),
        }
    } catch (error) {
        throw error
    }
}

export const getFilteredReceiptOptions = async () => {
    const uniqueHolders = await db
        .selectDistinct({ holder: warehouseReceipt.holder })
        .from(warehouseReceipt)
        .execute();

    const uniqueCommodityGroups = await db
        .selectDistinct({ commodityGroup: warehouseReceipt.commodityGroup })
        .from(warehouseReceipt)
        .execute();
        
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
