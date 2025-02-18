"use client"

import { db } from "@/db"
import { warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { WarehouseReceiptType } from "@/types";

export const createReceipt = async (receiptDetails: WarehouseReceiptType) => {

    const warehouseReceiptId = `WH${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const receipt = await db.insert(warehouseReceipt).values({
        id: warehouseReceiptId,
        warehouse_id: receiptDetails.warehouseId,
        holder: receiptDetails.holder,
        commodityVariety: receiptDetails.commodityVariety,
        commodityGroup: receiptDetails.commodityGroup,
        grade: receiptDetails.grade,
        currency: receiptDetails.currency,
        cropSeason: receiptDetails.cropSeason,
        createdAt: new Date(),
        updatedAt: new Date(),
    })
    return receipt
}

export const getReceipts = async () => {
    const receipt = await db.select().from(warehouseReceipt)
    return receipt
}