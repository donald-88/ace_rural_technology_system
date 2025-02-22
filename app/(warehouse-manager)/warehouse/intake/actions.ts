"use server"

import { createDeposit } from "@/lib/actions/intake.actions"
import { depositFormData, depositFormSchema } from "@/lib/validation"

export async function createIntakeAction(formData: depositFormData) {
    try {
        const validatedData = depositFormSchema.safeParse(formData)
        if (!validatedData.success) {
            return {
                status: "error",
                message: validatedData.error.message
            }
        }

        const result = await createDeposit({
            warehouseReceiptId: validatedData.data.warehouseReceiptNumber,
            depositorId: validatedData.data.depositorId,
            costProfile: validatedData.data.costProfile,
            incomingBags: validatedData.data.incomingBags.toString(),
            moisture: validatedData.data.moisture.toString(),
            deductions: validatedData.data.deductions.toString(),
            netWeight: validatedData.data.netWeight.toString(),
            weightEntries: validatedData.data.bagEntries.map((entry) => ({
                bagsWeighed: entry.numberOfBags.toString(),
                grossWeight: entry.grossWeight.toString(),
            }))
        })

        if (!result) {
            return {
                status: "error",
                message: "An error occurred while creating the deposit."
            }
        }

        return {
            status: "success",
            message: "Deposit created successfully.",
        }
    } catch (error) {
        return {
            status: "error",
            message: "An error occurred while creating the deposit."
        }
    }
}