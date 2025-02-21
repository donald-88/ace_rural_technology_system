import { createHandling } from "@/lib/actions/handling.actions";
import { handlingFormData, handlingFormSchema } from "@/lib/validation";

export default async function handlingAction(formData: handlingFormData) {
    try {
        const validatedData = handlingFormSchema.safeParse(formData)
        if (!validatedData.success) {
            return {
                status: "error",
                message: validatedData.error.message
            }
        }

        const result = await createHandling({
            warehouseReceiptId: validatedData.data.warehouseReceiptNumber,
            noOfBags: validatedData.data.outgoingBags.toString(),
            weightEntries: validatedData.data.bagEntries.map((entry) => ({
                bagsWeighed: entry.numberOfBags.toString(),
                grossWeight: entry.grossWeight.toString(),
            })),
            deductions: validatedData.data.deductions.toString(),
            netWeight: validatedData.data.netWeight.toString(),
        })

        return {
            status: "success",
            message: "Handling created successfully.",
        }

    } catch (error) {
        return {
            status: "error",
            message: "An error occurred while creating the handling."
        }
    }
} 