import { createDispatch, generateDPCId } from "@/lib/actions/dispatch.actions";
import { dispatchFormData, dispatchFormSchema } from "@/lib/validation";

export default async function disptachgAction(formData: dispatchFormData) {
    try {
        const validatedData = dispatchFormSchema.safeParse(formData)
        if (!validatedData.success) {
            return {
                status: "error",
                message: validatedData.error.message
            }
        }

        const id = await generateDPCId()

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
        })

        if (!result) {
            return {
                status: "error",
                message: "An error occurred while creating the dispatch."
            }
        }

        return {
            status: "success",
            message: "Dispatch created successfully.",
        }

    } catch (error) {
        return {
            status: "error",
            message: "An error occurred while creating the dispatch."
        }
    }
} 