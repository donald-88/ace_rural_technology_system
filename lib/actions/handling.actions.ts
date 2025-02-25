"use server"

import { db } from "@/db"
import { Handling, handling, NewHandling } from "@/db/schema/handling"
import { warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { NewWeightEntry, weightEntries } from "@/db/schema/weightEntries"
import { eq } from "drizzle-orm"

interface HandlingFormData {
    warehouseReceiptId: string
    noOfBags: string
    moisture?: string
    weightEntries: Array<{ bagsWeighed: string; grossWeight: string }>
    deductions: string
    netWeight: string
}

export const createHandling = async (handlingDetails: HandlingFormData) => {
    try {
        const newhandling = await db.insert(handling).values({
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