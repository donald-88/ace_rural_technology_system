"use client"

import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormFieldType } from '@/lib/types'
import { type depositFormData, depositFormSchema } from '@/lib/validation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MinusCircle, PlusCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { createIntakeAction } from './actions'
import { toast } from 'sonner'
import { CustomComboBox } from '@/components/customCombobox'
import { WarehouseReceipt } from '@/db/schema/warehouse-receipt'

interface IntakeFormProps {
    allReceipts: WarehouseReceipt[]
    data: any
}

function IntakeForm({ allReceipts, data }: IntakeFormProps) {
    const [currentWeight, setCurrentWeight] = useState<number>(0); // Current weight from the scale
    const [totalGrossWeight, setTotalGrossWeight] = useState<number>(0); // Total gross weight of all bags

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
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "bagEntries",
    });

    const watchedBagEntries = useWatch({
        control: form.control,
        name: "bagEntries",
    });

    const watchedDeductions = useWatch({
        control: form.control,
        name: "deductions",
    });

    // Fetch current weight from the scale every second
    useEffect(() => {
        const fetchWeight = async () => {
            try {
                const response = await fetch("/api/weight");
                const data = await response.json();
                setCurrentWeight(data.currentWeight); // Update current weight from the scale

                // Automatically update the gross weight of the last bag entry
                if (fields.length > 0) {
                    const lastIndex = fields.length - 1;
                    form.setValue(`bagEntries.${lastIndex}.grossWeight`, data.currentWeight);
                }
            } catch (error) {
                console.error('Error fetching weight:', error);
            }
        };

        const interval = setInterval(fetchWeight, 1000);
        return () => clearInterval(interval);
    }, [fields.length, form]);

    // Calculate total gross weight and net weight whenever bag entries or deductions change
    useEffect(() => {
        const totalGross = watchedBagEntries.reduce((sum, entry) => {
            return sum + entry.numberOfBags * entry.grossWeight;
        }, 0);

        setTotalGrossWeight(totalGross); // Update total gross weight

        const deductionAmount = totalGross * (watchedDeductions / 100);
        const calculatedNetWeight = totalGross - deductionAmount;

        form.setValue("netWeight", Number(calculatedNetWeight.toFixed(2))); // Update net weight in the form
    }, [watchedBagEntries, watchedDeductions, form]);

    // Reset form
    const resetForm = () => {
        form.reset()
    }
    async function onSubmit(data: depositFormData) {
        const result = await createIntakeAction(data);
        if (result.status === "error") {
            toast.error(result.message);
        } else {
            toast.success(result.message);
            resetForm();
        }
    }

    // Add a new bag entry with gross weight set to 0 initially
    const handleAddBag = () => {
        append({ numberOfBags: 1, grossWeight: 0 }); // New bag starts with gross weight 0
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 p-4"
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
                    fieldtype={FormFieldType.INPUT} defaultValue={0}                />

                <CustomFormField
                    control={form.control}
                    name="incomingBags"
                    label="Incoming Bags"
                    placeholder="0"
                    fieldtype={FormFieldType.NUMBER} defaultValue={0}                />

                <CustomFormField
                    control={form.control}
                    name="moisture"
                    label="Moisture"
                    placeholder="0%"
                    fieldtype={FormFieldType.NUMBER} defaultValue={0}                />

                {/* Bag Entries */}
                {fields.map((field, index) => (
                    <div key={field.id} className="col-span-2 flex gap-4">
                        <div className="w-full flex items-center gap-4">
                            <div className="mt-8">
                                {index === 0 ? (
                                    <PlusCircle
                                        size={24}
                                        className="cursor-pointer text-primary"
                                        onClick={handleAddBag} // Add new bag with gross weight 0
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
                                    fieldtype={FormFieldType.NUMBER} defaultValue={0}                                />
                            </div>
                        </div>
                        <div className="w-full items-center gap-4">
                            <CustomFormField
                                control={form.control}
                                name={`bagEntries.${index}.grossWeight`}
                                label="Gross Weight"
                                placeholder="0"
                                fieldtype={FormFieldType.NUMBER}
                                disabled // Disable manual input for gross weight
                                defaultValue={0}                            />
                        </div>
                    </div>
                ))}

                <CustomFormField
                    control={form.control}
                    name="deductions"
                    label="Deductions (%)"
                    placeholder="0"
                    fieldtype={FormFieldType.NUMBER} defaultValue={0}                />

                <CustomFormField
                    control={form.control}
                    name="netWeight"
                    label="Net Weight"
                    placeholder="0"
                    fieldtype={FormFieldType.INPUT}
                    disabled={true} defaultValue={0}                />

                <CustomFormField
                    control={form.control}
                    name="crnImage"
                    label="Upload CRN"
                    placeholder="Upload CRN"
                    fieldtype={FormFieldType.FILE} defaultValue={0}                />

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
    )
}
export default IntakeForm