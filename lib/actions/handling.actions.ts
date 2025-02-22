"use server"

import Handling from "@/models/handling"
import connectDB from "../mongodb"
import { db } from "@/db"
import { handling, NewHandling } from "@/db/schema/handling"
import { NewWeightEntry, weightEntries } from "@/db/schema/weightEntries"

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

export const getHandling = async () => {
    try {
        await connectDB()
        const handlings = await Handling.find({})
        return JSON.parse(JSON.stringify(handlings))

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const getHandlingById = async (intakeId: string) => {
    try {
        await connectDB()
        const handling = await Handling.findById({ intakeId: intakeId })
        return JSON.parse(JSON.stringify(handling))

    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export const deleteHandlingItem = async (handlingIds: string[]) => {
    try {
        await Handling.deleteMany({ intakeId: { $in: handlingIds } });
        return handlingIds.map((id) => ({ id }));
    } catch (error) {
        console.error("Error deleting handling items:", error);
        return handlingIds.map((id) => ({ id, message: "Error deleting inventory item" }));
    }
}