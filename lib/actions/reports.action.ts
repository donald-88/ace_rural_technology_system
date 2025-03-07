"use server"

import { db } from "@/db";
import { deposit } from "@/db/schema/deposit";
import { warehouseReceipt } from "@/db/schema/warehouse-receipt";
import { eq, sql } from "drizzle-orm";

export const getIntake = async () => {
    try {
        const result = await db.select({
            warehouseReceiptNumber: warehouseReceipt.id,
            holder: warehouseReceipt.holder,
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
        // .limit(pageSize)
        // .offset((page - 1) * pageSize)

        const [countResult] = await db.select({
            count: sql`count(*)`.mapWith(Number).as("count")
        }).from(warehouseReceipt).rightJoin(deposit, eq(warehouseReceipt.id, deposit.warehouseReceiptId))
        return {
            data: JSON.parse(JSON.stringify(result)),
            count: countResult.count
        }
    } catch (error) {
        throw error
    }
};
