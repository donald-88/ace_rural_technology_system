"use client"

import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { NewWarehouseReceipt } from '@/db/schema/warehouse-receipt'
import { FormFieldType } from '@/lib/types'
import { type depositFormData, depositFormSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { MinusCircle, PlusCircle } from 'lucide-react'
import React, { use, useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { createIntakeAction } from './actions'
import { toast } from 'sonner'
import { CustomComboBox } from '@/components/custom-combo-box'

function IntakeForm({ receipts }: { receipts: Promise<NewWarehouseReceipt[]> }) {
    const allReceipts = use(receipts)

    const form = useForm<depositFormData>({
        resolver: zodResolver(depositFormSchema),
        defaultValues: {
            warehouseReceiptNumber: "",
            depositorId: "",
            costProfile: "",
            incomingBags: 0,
            bagEntries: [{ numberOfBags: 0, grossWeight: 0 }],
            moisture: 0,
            netWeight: 0,
            deductions: 0,
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "bagEntries",
    })

    const watchedBagEntries = useWatch({
        control: form.control,
        name: "bagEntries",
    })

    const watchedDeductions = useWatch({
        control: form.control,
        name: "deductions",
    })

    useEffect(() => {
        const totalGrossWeight = watchedBagEntries.reduce((sum, entry) => {
            return sum + entry.numberOfBags * entry.grossWeight
        }, 0)

        const deductionAmount = totalGrossWeight * (watchedDeductions / 100)
        const calculatedNetWeight = totalGrossWeight - deductionAmount

        form.setValue("netWeight", Number(calculatedNetWeight.toFixed(2)))
    }, [watchedBagEntries, watchedDeductions, form])

    const resetForm = () => {
        form.reset()
    }
    async function onSubmit(data: depositFormData) {
        const result = await createIntakeAction(data)
        if (result.status === "error") {
            toast.error(result.message)
        } else {
            toast.success(result.message)
            resetForm()
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-4"
            >
                <CustomComboBox
                    control={form.control}
                    name="warehouseReceiptNumber"
                    label="Warehouse Receipt Number"
                    placeholder='Enter Warehouse Receipt Number'
                    options={
                        allReceipts.map((receipt) => ({
                            label: receipt.holder,
                            value: receipt.holder
                        }))
                    } />

                <CustomFormField
                    control={form.control}
                    name="depositorId"
                    label="Depositor ID"
                    placeholder="Enter Depositor ID"
                    fieldtype={FormFieldType.INPUT}
                />

                <CustomFormField
                    control={form.control}
                    name="costProfile"
                    label="Cost Profile"
                    placeholder="Enter cost profile"
                    fieldtype={FormFieldType.INPUT}
                />

                <CustomFormField
                    control={form.control}
                    name="incomingBags"
                    label="Incoming Bags"
                    placeholder="0"
                    fieldtype={FormFieldType.NUMBER}
                />

                <CustomFormField
                    control={form.control}
                    name="moisture"
                    label="Moisture"
                    placeholder="0%"
                    fieldtype={FormFieldType.NUMBER}
                />

                {fields.map((field, index) => (
                    <div key={field.id} className="col-span-2 flex gap-4">
                        <div className="w-full flex items-center gap-4">
                            <div className="mt-8">
                                {index === 0 ? (
                                    <PlusCircle
                                        size={24}
                                        className="cursor-pointer text-primary"
                                        onClick={() => append({ numberOfBags: 0, grossWeight: 0 })}
                                    />
                                ) : (
                                    <MinusCircle
                                        className="cursor-pointer text-red-600"
                                        onClick={() => remove(index)}
                                    />
                                )}
                            </div>
                            <div className="w-full">
                                <CustomFormField
                                    control={form.control}
                                    name={`bagEntries.${index}.numberOfBags`}
                                    label="Bags Weighed"
                                    placeholder="0"
                                    fieldtype={FormFieldType.NUMBER}
                                />
                            </div>
                        </div>
                        <div className="w-full items-center gap-4">
                            <CustomFormField
                                control={form.control}
                                name={`bagEntries.${index}.grossWeight`}
                                label="Gross Weight"
                                placeholder="0"
                                fieldtype={FormFieldType.NUMBER}
                            />
                        </div>
                    </div>
                ))}

                <CustomFormField
                    control={form.control}
                    name="deductions"
                    label="Deductions (%)"
                    placeholder="0"
                    fieldtype={FormFieldType.NUMBER}
                />

                <CustomFormField
                    control={form.control}
                    name="netWeight"
                    label="Net Weight"
                    placeholder="0"
                    fieldtype={FormFieldType.INPUT}
                    disabled={true}
                />

                <CustomFormField
                    control={form.control}
                    name="crnImage"
                    label="Upload CRN"
                    placeholder="Upload CRN"
                    fieldtype={FormFieldType.FILE}
                />

                <div className="w-full flex justify-end gap-2 col-span-2">
                    <Button type="button" className="col-span-2" variant={"outline"} onClick={resetForm}>
                        Reset Form
                    </Button>
                    <Button className="col-span-2" type="submit">
                        Intake
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default IntakeForm