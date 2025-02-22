"use server"

import Dispatch from "@/models/dispatch"
import connectDB from "../mongodb"
import { db } from "@/db"
import { dispatch, NewDispatch } from "@/db/schema/dispatch"
import { NewWeightEntry, weightEntries } from "@/db/schema/weightEntries"

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
        await connectDB()
        const dispatches = await Dispatch.find({})
        return JSON.parse(JSON.stringify(dispatches))

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getDispatchById = async (intakeId: string) => {
    try {
        await connectDB()
        const dispatch = await Dispatch.findById({ intakeId: intakeId })
        return JSON.parse(JSON.stringify(dispatch))
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const deleteDispatchItem = async (dispatchIds: string[]) => {
    try {
        await Dispatch.deleteMany({ intakeId: { $in: dispatchIds } });
        return dispatchIds.map((id) => ({ id }));
    } catch (error) {
        console.error("Error deleting handling items:", error);
        return dispatchIds.map((id) => ({ id, message: "Error deleting inventory item" }));
    }
}