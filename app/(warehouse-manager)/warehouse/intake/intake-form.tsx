"use client"

import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormFieldType } from '@/lib/types'
import { type depositFormData, depositFormSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MinusCircle, PlusCircle } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { createIntakeAction } from './actions'
import { toast } from 'sonner'
import { CustomComboBox } from '@/components/customCombobox'
import { WarehouseReceipt } from '@/db/schema/warehouse-receipt'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'


interface IntakeFormProps {
    allReceipts: WarehouseReceipt[]
    data: any
}

function IntakeForm({ allReceipts, data }: IntakeFormProps) {


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

    const selectedReceipt = useWatch({
        control: form.control,
        name: "warehouseReceiptNumber",
    })

    const receiptDetails = allReceipts.find((receipt) => receipt.id === selectedReceipt)

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
        <section className='grid grid-cols-2 gap-4'>
            <Card>
                <CardHeader>
                    <CardTitle className='text-[13px]'>INTAKE DETAILS</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <div className='grid grid-cols-2 gap-4'>
                                <CustomComboBox
                                    control={form.control}
                                    name="warehouseReceiptNumber"
                                    label="Warehouse Receipt Number"
                                    placeholder='Enter Warehouse Receipt Number'
                                    options={
                                        allReceipts.map((receipt: WarehouseReceipt) => ({
                                            label: receipt.id,
                                            subLabel: receipt.holder,
                                            value: receipt.id
                                        }))
                                    } />

                                <CustomComboBox
                                    control={form.control}
                                    name="depositorId"
                                    label="Depossitor"
                                    placeholder='Enter Depositor'
                                    options={
                                        data.map((receipt: any) => ({
                                            label: receipt.name,
                                            subLabel: receipt.phone,
                                            value: receipt.name
                                        }))
                                    } />
                            </div>

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
                                    Reset
                                </Button>
                                <Button className="col-span-2" type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? <span className='flex items-center'><Loader2 size={16} className='animate-spin mr-2' />Submiting</span> : "Submit"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className='h-min'>
                <CardHeader>
                    <CardTitle className='text-[13px]'>WAREHOUSE RECEIPT SUMMARY</CardTitle>
                </CardHeader>
                <CardContent className='h-min flex flex-col justify-start items-center'>
                    {
                        receiptDetails ? (
                            <ul className='grid grid-cols-[240px_1fr] gap-y-3 gap-x-4 w-full'>
                                <dt className='text-sm text-muted-foreground'>Warehouse Receipt Number: </dt>
                                <dd className='text-sm font-medium'>{receiptDetails.id}</dd>

                                <dt className='text-sm text-muted-foreground'>Warehouse: </dt>
                                <dd className='text-sm font-medium'>{receiptDetails.warehouse_id}</dd>

                                <dt className='text-sm text-muted-foreground'>Holder: </dt>
                                <dd className='text-sm font-medium'>{receiptDetails.holder}</dd>

                                <dt className='text-sm text-muted-foreground'>Commodity Group: </dt>
                                <dd className='text-sm font-medium'>{receiptDetails.commodityGroup}</dd>

                                <dt className='text-sm text-muted-foreground'>Commodity Variety: </dt>
                                <dd className='text-sm font-medium'>{receiptDetails.commodityVariety}</dd>

                                <dt className='text-sm text-muted-foreground'>Grade: </dt>
                                <dd className='text-sm font-medium'>{receiptDetails.grade}</dd>

                                <dt className='text-sm text-muted-foreground'>Currency: </dt>
                                <dd className='text-sm font-medium'>{receiptDetails.currency}</dd>

                                <dt className='text-sm text-muted-foreground'>Crop Season: </dt>
                                <dd className='text-sm font-medium'>{receiptDetails.cropSeason}</dd>
                            </ul>
                        ) : (
                            <div className='min-h-56 flex justify-center items-center'>
                                <p className='text-secondary'>No warehouse receipt selected</p>
                            </div>
                        )
                    }
                </CardContent>
                <CardFooter>
                    <p className='text-xs text-muted-foreground'>This document summarizes the details of the selected warehouse receipt. Please verify the information and make sure you are attaching to the correct receipt before proceeding.</p>
                </CardFooter>
            </Card>
        </section>
    )
}
export default IntakeForm