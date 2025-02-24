"use client"

import { CustomComboBox } from '@/components/customCombobox'
import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { WarehouseReceipt } from '@/db/schema/warehouse-receipt'
import { FormFieldType } from '@/lib/types'
import { dispatchFormData, dispatchFormSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MinusCircle, PlusCircle } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import disptachgAction from './actions'
import { toast } from 'sonner'

export default function DispatchForm({ allReceipts }: { allReceipts: WarehouseReceipt[] }) {

    const form = useForm<dispatchFormData>({
        resolver: zodResolver(dispatchFormSchema),
        defaultValues: {
            drawdownId: "",
            outgoingBags: 0,
            bagEntries: [{ numberOfBags: 0, grossWeight: 0 }],
            netWeight: 0,
            deductions: 0,
        },
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

    async function onSubmit(data: dispatchFormData) {
        const result = await disptachgAction(data)
        if (result.status === "error") {
            toast.error(result.message)
        } else {
            toast.success(result.message)
            resetForm()
        }
    }

    return (
        <Form {...form} >
            <form className="flex flex-col w-full max-w-2xl gap-4 p-4" onSubmit={form.handleSubmit(onSubmit)} >
                <CustomComboBox
                    control={form.control}
                    name="warehouseReceiptNumber"
                    label="Warehouse Receipt Number"
                    placeholder='Enter Warehouse Receipt Number'
                    options={
                        allReceipts.map((receipt: WarehouseReceipt) => ({
                            label: receipt.id,
                            value: receipt.id
                        }))
                    } />

                <CustomFormField
                    control={form.control}
                    name="drawdownId"
                    label="Drawdown ID"
                    placeholder="Enter Drawdown ID"
                    fieldtype={FormFieldType.INPUT}
                />

                <CustomFormField
                    control={form.control}
                    name="outgoingBags"
                    label="Outgoing Bags"
                    placeholder="0"
                    fieldtype={FormFieldType.NUMBER}
                    disabled={true}
                />

                {
                    fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-2 gap-4" >
                            <div className="w-full flex items-center gap-4" >
                                <div className="mt-8" >
                                    {index === 0 ? (
                                        <PlusCircle
                                            size={24}
                                            className="cursor-pointer text-primary"
                                            onClick={() => append({ numberOfBags: 0, grossWeight: 0 })}
                                        />
                                    ) : (
                                        <MinusCircle
                                            className="cursor-pointer text-red-600"
                                            onClick={() => remove(index)
                                            }
                                        />
                                    )}
                                </div>
                                < div className="flex-1 w-full" >
                                    <CustomFormField
                                        control={form.control}
                                        name={`bagEntries.${index}.numberOfBags`}
                                        label="Bags Weighed"
                                        placeholder="0"
                                        fieldtype={FormFieldType.NUMBER}
                                    />
                                </div>
                            </div>
                            < div className="w-full flex-1 items-center gap-4" >
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
                    fieldtype={FormFieldType.NUMBER}
                    disabled={true}
                />

                <div className="flex justify-end gap-2" >
                    <Button type='button' variant={"outline"} className="col-span-2" onClick={resetForm}>
                        Reset
                    </Button>
                    <Button type="submit" className="col-span-2" disabled={form.formState.isSubmitting} >
                        {form.formState.isSubmitting ? <span className='flex items-center'><Loader2 size={16} className='animate-spin mr-2' />Submiting</span> : "Submit"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
