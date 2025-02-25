"use server"

import { db } from "@/db"
import { dispatch, NewDispatch } from "@/db/schema/dispatch"
import { warehouseReceipt } from "@/db/schema/warehouse-receipt"
import { NewWeightEntry, weightEntries } from "@/db/schema/weightEntries"
import { eq } from "drizzle-orm"

interface DispatchFormData {
    warehouseReceiptId: string
    drawDownId: string
    noOfBags: string
    weightEntries: Array<{ bagsWeighed: string; grossWeight: string }>
    deductions: string
    netWeight: string
}

export const createDispatch = async (dispatchDetails: DispatchFormData) => {
    try {
        const newdispatch = await db.insert(dispatch).values({
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
        console.error("Error creating intake:", error)
        throw error
    }
}

export const getDispatch = async () => {
    try {
        const dispatchData = await db.select({
            warehouseReceiptNumber: warehouseReceipt.id,
            commodityGroup: warehouseReceipt.commodityGroup,
            commodityVariety: warehouseReceipt.commodityVariety,
            drawdownId: dispatch.drawDownId,
            dispatchId: dispatch.id,
            noOfBags: dispatch.noOfBags,
            netWeight: dispatch.netWeight,
            createdAt: dispatch.createdAt,
        }
        ).from(warehouseReceipt).rightJoin(dispatch, eq(warehouseReceipt.id, dispatch.warehouseReceiptId))
        return JSON.parse(JSON.stringify(dispatchData))
    }
    catch (error) {
        console.error("Error fetching dispatch:", error)
        throw error
    }
}

// export const deleteDispatchItem = async (dispatchIds: string[]) => {
//     try {
//         await Dispatch.deleteMany({ intakeId: { $in: dispatchIds } });
//         return dispatchIds.map((id) => ({ id }));
//     } catch (error) {
//         console.error("Error deleting handling items:", error);
//         return dispatchIds.map((id) => ({ id, message: "Error deleting inventory item" }));
//     }
// }