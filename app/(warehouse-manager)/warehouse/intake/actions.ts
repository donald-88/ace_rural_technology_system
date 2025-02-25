"use server";

import { createDeposit, generateINKId } from "@/lib/actions/intake.actions"
import { depositFormData, depositFormSchema } from "@/lib/validation"
import { ZodError } from "zod";

export async function createIntakeAction(formData: depositFormData) {
    try {
        // Validate the form data using Zod
        const validatedData = depositFormSchema.safeParse(formData);
        if (!validatedData.success) {
            return {
                status: "error",
                message: validatedData.error.message,
            };
        }

        const id = await generateINKId()

        const result = await createDeposit({
            id: id,
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
            })),
        });

        // Calculate total gross weight from weightEntries
        const totalGrossWeight = validatedData.data.bagEntries.reduce(
            (sum, entry) => sum + Number(entry.grossWeight),
            0
        );

        // Send data to the printing API
        const printResponse = await fetch("http://localhost:3000/api/print", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...validatedData.data,
                grossWeight: totalGrossWeight, // Include grossWeight in the data
            }),
        });

        // Check if the printing API request was successful
        if (!printResponse.ok) {
            throw new Error("Failed to print details");
        }

        // Return success response
        return {
            status: "success",
            message: "Deposit created successfully.",
        };
    } catch (error) {
        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return {
                status: "error",
                message: error.message,
            };
        }

        // Handle general errors
        console.error("Error creating deposit:", error);
        return {
            status: "error",
            message: "An error occurred while creating the deposit.",
        };
    }
}