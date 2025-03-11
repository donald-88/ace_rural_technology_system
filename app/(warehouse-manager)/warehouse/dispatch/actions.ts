import { createDispatch, generateDPCId } from "@/lib/actions/dispatch.actions";
import { dispatchFormData, dispatchFormSchema } from "@/lib/validation";
import { WarehouseReceipt } from "@/db/schema/warehouse-receipt";

export default async function disptachgAction(
    formData: dispatchFormData,
    allReceipts: WarehouseReceipt[] // Pass allReceipts to the action
) {
    try {
        const validatedData = dispatchFormSchema.safeParse(formData);
        if (!validatedData.success) {
            return {
                status: "error",
                message: validatedData.error.message,
            };
        }

        const id = await generateDPCId();

        // Create the dispatch in the database
        const result = await createDispatch({
            id: id,
            warehouseReceiptId: validatedData.data.warehouseReceiptNumber,
            noOfBags: validatedData.data.outgoingBags.toString(),
            weightEntries: validatedData.data.bagEntries.map((entry) => ({
                bagsWeighed: entry.numberOfBags.toString(),
                grossWeight: entry.grossWeight.toString(),
            })),
            deductions: validatedData.data.deductions.toString(),
            netWeight: validatedData.data.netWeight.toString(),
            drawDownId: validatedData.data.drawdownId.toString(),
        });

        if (!result) {
            return {
                status: "error",
                message: "An error occurred while creating the dispatch.",
            };
        }

        // Find the selected warehouse receipt details
        const warehouseReceiptDetails = allReceipts.find(
            (receipt) => receipt.id === validatedData.data.warehouseReceiptNumber
        );

        if (!warehouseReceiptDetails) {
            return {
                status: "error",
                message: "Warehouse receipt not found.",
            };
        }

        // Calculate total gross weight from weightEntries
        const totalGrossWeight = validatedData.data.bagEntries.reduce(
            (sum, entry) => sum + Number(entry.grossWeight),
            0
        );

        // Prepare the payload for printing
        const printPayload = {
            formData: validatedData.data, // Include all validated form data
            warehouseReceiptDetails: {
                id: warehouseReceiptDetails.id,
                warehouse_id: warehouseReceiptDetails.warehouse_id,
                holder: warehouseReceiptDetails.holder,
                commodityGroup: warehouseReceiptDetails.commodityGroup,
                commodityVariety: warehouseReceiptDetails.commodityVariety,
                grade: warehouseReceiptDetails.grade,
                currency: warehouseReceiptDetails.currency,
                cropSeason: warehouseReceiptDetails.cropSeason,
            },
            grossWeight: totalGrossWeight,
            netWeight: validatedData.data.netWeight,
        };

        // Send data to the printing API
        const printResponse = await fetch("http://192.168.137.150:5001/print", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(printPayload),
        });

        // Check if the printing API request was successful
        if (!printResponse.ok) {
            throw new Error("Failed to print details");
        }

        // Return success response
        return {
            status: "success",
            message: "Dispatch created and printed successfully.",
        };
    } catch (error) {
        console.error("Error creating dispatch:", error);
        return {
            status: "error",
            message: "An error occurred while creating the dispatch.",
        };
    }
}