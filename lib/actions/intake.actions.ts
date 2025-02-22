"use server"

import Intake from "@/models/intake"
import connectDB from "../mongodb"
import Client from "@/models/clients"
import { db } from "@/db"
import { deposit, type NewDeposit } from "@/db/schema/deposit"
import { weightEntries, type NewWeightEntry } from "@/db/schema/weightEntries"

interface DepositFormData {
    warehouseReceiptId: string
    depositorId: string
    costProfile: string
    incomingBags: string
    moisture: string
    weightEntries: Array<{ bagsWeighed: string; grossWeight: string }>
    deductions: string
    netWeight: string
    crnImageUrl?: string
}

export const createDeposit = async (depositDetails: DepositFormData) => {
    try {
        const newReceipt = await db.insert(deposit)
            .values({
                warehouseReceiptId: depositDetails.warehouseReceiptId,
                depositorId: depositDetails.depositorId,
                costProfile: depositDetails.costProfile,
                incomingBags: Number.parseInt(depositDetails.incomingBags, 10),
                moisture: depositDetails.moisture,
                deductions: depositDetails.deductions,
                netWeight: depositDetails.netWeight,
                crnImageUrl: depositDetails.crnImageUrl,
            } as NewDeposit)
            .returning({ id: deposit.id })

        // Insert the weight entries
        const weightEntriesData: NewWeightEntry[] = depositDetails.weightEntries.map((entry) => ({
            depositId: newReceipt[0].id.toString(),
            bagsWeighed: Number.parseInt(entry.bagsWeighed, 10),
            grossWeight: entry.grossWeight,
        }))

        await db.insert(weightEntries).values(weightEntriesData)

        return JSON.parse(JSON.stringify(newReceipt))
    } catch (error) {
        console.error("Error inserting warehouse receipt:", error)
        throw error
    }
}

export const getIntake = async () => {
    try {
        const result = await db.select().from(deposit)

        return JSON.parse(JSON.stringify(result))
    } catch (error) {
        console.error("Error getting intake:", error);
        return {
            message: "Error getting intake",
        };
    }
};

export const getIntakeById = async (intakeId: string) => {
    try {
        await connectDB()
        const intake = await Intake.findOne({ intakeId: intakeId })

        return JSON.parse(JSON.stringify(intake))
    } catch (error) {
        console.error("Error getting intake:", error)
        return {
            message: "Error getting intake",
        }
    }
}

export async function deleteIntakeItems(inventoryItemIds: string[]) {
    try {
        await Intake.deleteMany({ intakeId: { $in: inventoryItemIds } });
        return inventoryItemIds.map((id) => ({ id }));
    } catch (error) {
        console.error("Error deleting intake items:", error);
        return inventoryItemIds.map((id) => ({ id, message: "Error deleting inventory item" }));
    }
}