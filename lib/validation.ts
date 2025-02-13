import { z } from "zod"

export const bagEntrySchema = z.object({
    numberOfBags: z.number().min(1, "Must have at least one bag"),
    grossWeight: z.number().min(0.1, "Gross weight must be atleast 0.1"),
})

export const dispatchFormSchema = z.object({
    warehouseReceiptNumber: z.string().min(1, "Warehouse receipt number is required"),
    drawdownId: z.string().min(1, "Drawdown ID is required"),
    outgoingBags: z.number().min(1, "Must have at least one bag"),
    bagEntries: z.array(bagEntrySchema),
    netWeight: z.number().min(0.1, "Net weight must be atleast 0.1"),
    deductions: z.number().min(0, "Deductions must be positive"),
})

export const handlingFormSchema = z.object({
    warehouseReceiptNumber: z.string().min(1, "Warehouse receipt number is required"),
    outgoingBags: z.number().min(1, "Must have at least one bag"),
    bagEntries: z.array(bagEntrySchema),
    netWeight: z.number().min(0.1, "Net weight must be atleast 0.1"),
    moisture: z.number().min(0, "Moisture must be positive"),
    deductions: z.number().min(0, "Deductions must be positive"),
})

export const intakeFormSchema = z.object({
    warehouseId: z.string().min(1, "Warehouse ID is required"),
    warehouseReceiptNumber: z.string().min(1, "Recording receipt is required"),
    clientId: z.string().min(1, "Client ID is required"),
    commodity: z.string().min(1, "Commodity is required"),
    variety: z.string().min(1, "Variety is required"),
    grade: z.number().min(0.1, "Grade is required"),
    costProfile: z.string().min(1, "Cost profile is required"),
    incomingBags: z.number().min(1, "Must have at least one bag"),
    bagEntries: z.array(bagEntrySchema),
    netWeight: z.number().min(0.1, "Net weight must be atleast 0.1"),
    moisture: z.number().min(0.1, "Moisture must be positive"),
    deductions: z.number().min(0, "Deductions must be positive"),
})

export type intakeFormData = z.infer<typeof intakeFormSchema>
export type dispatchFormData = z.infer<typeof dispatchFormSchema>
export type handlingFormData = z.infer<typeof handlingFormSchema>
