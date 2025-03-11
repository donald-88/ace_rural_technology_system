"use client";

import { CustomComboBox } from '@/components/customCombobox';
import CustomFormField from '@/components/customFormField';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { WarehouseReceipt } from '@/db/schema/warehouse-receipt';
import { FormFieldType } from '@/lib/types';
import { handlingFormData, handlingFormSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, MinusCircle, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import handlingAction from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function HandlingForm({ allReceipts }: { allReceipts: WarehouseReceipt[] }) {
    const [currentWeight, setCurrentWeight] = useState<number>(0); // State to store current weight from the scale

    const form = useForm<handlingFormData>({
        resolver: zodResolver(handlingFormSchema),
        defaultValues: {
            warehouseReceiptNumber: "",
            outgoingBags: 0,
            bagEntries: [{ numberOfBags: 0, grossWeight: 0 }],
            moisture: 0,
            netWeight: 0,
            deductions: 0,
        },
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

    // Calculate total gross weight and net weight
    useEffect(() => {
        const totalGrossWeight = watchedBagEntries.reduce((sum, entry) => {
            return sum + entry.numberOfBags * entry.grossWeight;
        }, 0);

        const calculatedNetWeight = totalGrossWeight - watchedDeductions;

        form.setValue("netWeight", Number(calculatedNetWeight.toFixed(2)));
    }, [watchedBagEntries, watchedDeductions, form]);

    const resetForm = () => {
        form.reset();
    };

    async function onSubmit(data: handlingFormData) {
        const result = await handlingAction(data);
        if (result.status === "error") {
            toast.error(result.message);
        } else {
            toast.success(result.message);
            resetForm();
        }
    }

    return (
        <Card className='w-[640px]'>
            <CardHeader>
                <CardTitle className="text-[13px]">HANDLING DETAILS</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="flex flex-col w-full max-w-2xl gap-4" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Warehouse ID */}
                        <CustomComboBox
                            control={form.control}
                            name="warehouseReceiptNumber"
                            label="Warehouse Receipt Number"
                            placeholder='Enter Warehouse Receipt Number'
                            options={
                                allReceipts.map((receipt: WarehouseReceipt) => ({
                                    label: receipt.id,
                                    value: receipt.id,
                                }))
                            }
                        />

                        {/* No. of Bags */}
                        <CustomFormField
                            control={form.control}
                            name="outgoingBags"
                            label="Number of Bags"
                            placeholder="0"
                            fieldtype={FormFieldType.NUMBER}
                        />

                        {/* Bag Entries */}
                        {fields.map((field, index) => (
                            <div key={field.id} className="grid grid-cols-2 gap-4">
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
                                    <div className="flex-1 w-full">
                                        <CustomFormField
                                            control={form.control}
                                            name={`bagEntries.${index}.numberOfBags`}
                                            label="Bags Weighed"
                                            placeholder="0"
                                            fieldtype={FormFieldType.NUMBER}
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex-1 items-center gap-4">
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

                        {/* Moisture */}
                        <CustomFormField
                            control={form.control}
                            name="moisture"
                            label="Moisture (%)"
                            placeholder="0%"
                            fieldtype={FormFieldType.NUMBER}
                        />

                        {/* Deductions */}
                        <CustomFormField
                            control={form.control}
                            name="deductions"
                            label="Deductions"
                            placeholder="0"
                            fieldtype={FormFieldType.NUMBER}
                        />

                        {/* Net Weight */}
                        <CustomFormField
                            control={form.control}
                            name="netWeight"
                            label="Net Weight"
                            placeholder="0"
                            fieldtype={FormFieldType.INPUT}
                            disabled={true}
                        />

                        {/* Submit Button */}
                        <div className="flex justify-end gap-2">
                            <Button type='button' variant={"outline"} className="col-span-2" onClick={resetForm}>
                                Reset
                            </Button>
                            <Button type="submit" className="col-span-2" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? (
                                    <span className='flex items-center'>
                                        <Loader2 size={16} className='animate-spin mr-2' />
                                        Submitting
                                    </span>
                                ) : "Submit"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default HandlingForm;