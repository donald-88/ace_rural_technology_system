import { z } from "zod"

export const receiptFormSchema = z.object({
    warehouseId: z.string().min(1, { message: "Warehouse is required." }),
    holder: z.string().min(2, { message: "Holder is required." }),
    commodityVariety: z.string().min(1, { message: "Commodity variety is required." }),
    commodityGroup: z.string().min(1, { message: "Commodity group is required." }),
    grade: z.string().min(1, { message: "Commodity grade is required." }),
     // Make currency optional in the validation schema but provide a default
     currency: z.string().default("MWK"), // Use an appropriate default currency
    cropSeason: z.string().min(1, { message: "Crop season is required." })
})

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
    crnImage: z
        .instanceof(File)
        .optional()
        .refine((file) => file === undefined || (file.size <= 3000000 && file.type.startsWith("image/")), {
            message: "File must be an image less than 5MB",
        }),
})

export const handlingFormSchema = z.object({
    warehouseReceiptNumber: z.string().min(1, "Warehouse receipt number is required"),
    outgoingBags: z.number().min(1, "Must have at least one bag"),
    bagEntries: z.array(bagEntrySchema),
    netWeight: z.number().min(0.1, "Net weight must be atleast 0.1"),
    moisture: z.number().min(0, "Moisture must be positive"),
    deductions: z.number().min(0, "Deductions must be positive"),
})

export const depositFormSchema = z.object({
    warehouseReceiptNumber: z.string().min(1, "Recording receipt is required"),
    depositorId: z.string().min(1, "Depositor ID is required"),
    costProfile: z.string().min(1, "Cost profile is required"),
    incomingBags: z.number().min(1, "Must have at least one bag"),
    bagEntries: z.array(bagEntrySchema),
    netWeight: z.number().min(0.1, "Net weight must be atleast 0.1"),
    moisture: z.number().min(0.1, "Moisture must be positive"),
    deductions: z.number().min(0, "Deductions must be positive"),
})

export const teamMemberformSchema = z.object({
    name: z.string().min(2, {
        message: "Username must be at least 2 characters."
    }),
    email: z.string().email({
        message: "Please enter a valid email address."
    }),
    role: z.string().min(1, {
        message: "Please select a role."
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters."
    })
})

export const requestAccessFormSchema = z.object({
    deviceId: z.string().min(1, {
        message: "Device ID is required."
    }),
    reason: z.string().min(1, {
        message: "Reason is required."
    }),
})

export const searchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    depositId: z.string().optional(),
    depositorId: z.string().optional(),
    holder: z.string().optional(),
    commodityGroup: z.string().optional(),
    commodityVariety: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
})

export const handlingSearchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
})

export const dispatchSearchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
})

export const accessLogsSearchParamsSchema = z.object({
    page: z.coerce.number().default(1),
    per_page: z.coerce.number().default(10),
    sort: z.string().optional(),
    lockId: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    operator: z.enum(["and", "or"]).optional(),
})

export type receiptFormData = z.infer<typeof receiptFormSchema>
export type depositFormData = z.infer<typeof depositFormSchema>
export type dispatchFormData = z.infer<typeof dispatchFormSchema>
export type handlingFormData = z.infer<typeof handlingFormSchema>
export type teamMemberformData = z.infer<typeof teamMemberformSchema>
export type requestAccessFormData = z.infer<typeof requestAccessFormSchema>
export type searchParamsData = z.infer<typeof searchParamsSchema>
export type handlingSearchParamsData = z.infer<typeof handlingSearchParamsSchema>
export type dispatchSearchParamsData = z.infer<typeof dispatchSearchParamsSchema>
export type accessLogsSearchParamsData = z.infer<typeof accessLogsSearchParamsSchema>
