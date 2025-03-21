"use server"

import { db } from "@/db";
import { Deposit, deposit } from "@/db/schema/deposit";
import { warehouseReceipt } from "@/db/schema/warehouse-receipt";
import { and, AnyColumn, asc, count, countDistinct, desc, eq, gte, inArray, lte, or, SQL, sum } from "drizzle-orm";
import { searchParamsData } from "../validation";
import { InventoryItemType } from "@/types";
import { filterColumn } from "../filter-column";
import { revalidatePath } from "next/cache";


export async function getDepositWithWarehouseReceipt(input: searchParamsData) {
    const { page, per_page, sort, depositId, depositorId, holder, commodityGroup, commodityVariety, from, to, operator } = input;

    try {
        // Calculate offset for pagination
        const offset = (page - 1) * per_page

        // Split the sort string to determine column and order
        const [column, order] = (sort?.split(".").filter(Boolean) ?? [
            "createdAt",
            "desc",
        ]) as [keyof Deposit | "holder" | "commodityGroup" | "commodityVariety" | undefined, "asc" | "desc" | undefined]


        // Convert date strings to Date objects for date filtering
        const fromDay = from ? new Date(from) : undefined
        const toDay = to ? new Date(to) : undefined

        const depositExpressions: (SQL<unknown> | undefined)[] = [
            // Apply depositorId filter if provided
            depositId
                ? filterColumn({
                    column: deposit.id,
                    value: depositId,
                })
                : undefined,

            depositorId
                ? filterColumn({
                    column: deposit.depositorId,
                    value: depositorId,
                })
                : undefined,

            // Apply date range filter if both dates are provided
            fromDay && toDay
                ? and(gte(deposit.createdAt, fromDay), lte(deposit.createdAt, toDay))
                : undefined,
        ]

        const warehouseReceiptExpressions: (SQL<unknown> | undefined)[] = [
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

        // Combine all expressions
        const allExpressions = [
            ...depositExpressions as SQL<InventoryItemType>[],
            ...warehouseReceiptExpressions as SQL<InventoryItemType>[]
        ].filter(Boolean);

        // Combine filters using "and" or "or" based on the operator
        const where = allExpressions.length > 0
            ? (!operator || operator === "and" ? and(...allExpressions) : or(...allExpressions))
            : undefined


        const result = await db.select({
            depositId: deposit.id,
            warehouseReceiptId: deposit.warehouseReceiptId,
            depositorId: deposit.depositorId,
            costProfile: deposit.costProfile,
            incomingBags: deposit.incomingBags,
            moisture: deposit.moisture,
            netWeight: deposit.netWeight,
            createdAt: deposit.createdAt,
            holder: warehouseReceipt.holder,
            commodityGroup: warehouseReceipt.commodityGroup,
            commodityVariety: warehouseReceipt.commodityVariety,
        }).from(warehouseReceipt).rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
            .limit(per_page)
            .offset(offset)
            .where(where)
            .orderBy(
                column && column in deposit
                    ? order === "asc"
                        ? asc(deposit[column as keyof typeof deposit] as AnyColumn)
                        : desc(deposit[column as keyof typeof deposit] as AnyColumn)
                    : column === "holder"
                        ? order === "asc"
                            ? asc(warehouseReceipt.holder)
                            : desc(warehouseReceipt.holder)
                        : column === "commodityGroup"
                            ? order === "asc"
                                ? asc(warehouseReceipt.commodityGroup)
                                : desc(warehouseReceipt.commodityGroup)
                            : column === "commodityVariety"
                                ? order === "asc"
                                    ? asc(warehouseReceipt.commodityVariety)
                                    : desc(warehouseReceipt.commodityVariety)
                                : desc(deposit.createdAt as AnyColumn)
            )


        const totalRows = await db
            .select({ count: count() })
            .from(warehouseReceipt).rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

        const totalDepositors = await db
            .select({ count: countDistinct(deposit.depositorId) })
            .from(warehouseReceipt)
            .rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

        const totalCommodityGroups = await db
            .select({ count: countDistinct(warehouseReceipt.commodityGroup) })
            .from(warehouseReceipt)
            .rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)


        const totalCommodityVarieties = await db
            .select({ count: countDistinct(warehouseReceipt.commodityVariety) })
            .from(warehouseReceipt)
            .rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0)

        const totalNetWeight = await db
            .select({ total: sum(deposit.netWeight) })
            .from(warehouseReceipt)
            .rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
            .where(where)
            .execute()
            .then((res) => res[0]?.total ?? 0);


        return {
            data: JSON.parse(JSON.stringify(result)),
            total: totalRows,
            pageCount: Math.ceil(totalRows / per_page),
            totalDepositors,
            totalCommodityGroups,
            totalCommodityVarieties,
            totalNetWeight,
        }
    } catch (error) {
        throw error
    }
};


export async function getFilteredOptions() {
    const uniqueHolders = await db
        .selectDistinct({ holder: warehouseReceipt.holder })
        .from(warehouseReceipt)
        .rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
        .execute();

    const uniqueCommodityGroups = await db
        .selectDistinct({ commodityGroup: warehouseReceipt.commodityGroup })
        .from(warehouseReceipt)
        .rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
        .execute();

    const uniqueCommodityVarieties = await db
        .selectDistinct({ commodityVariety: warehouseReceipt.commodityVariety })
        .from(warehouseReceipt)
        .rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
        .execute();

    const uniqueDepositors = await db
        .selectDistinct({ depositorId: deposit.depositorId })
        .from(warehouseReceipt)
        .rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
        .execute();

    return {
        uniqueHolders: uniqueHolders.map((item) => item.holder),
        uniqueCommodityGroups: uniqueCommodityGroups.map((item) => item.commodityGroup),
        uniqueCommodityVarieties: uniqueCommodityVarieties.map((item) => item.commodityVariety),
        uniqueDepositors: uniqueDepositors.map((item) => item.depositorId)
    }
}

export async function deleteReportAction(inventoryItemIds: string[]) {
    try {
        await db.delete(deposit).where(inArray(deposit.id, inventoryItemIds))
        revalidatePath(`${process.env.BASE_URL}/reports`)
        return { success: true, data: [] }
    } catch (error) {
        console.error("Error deleting reports:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete reports"
        }
    }
}
