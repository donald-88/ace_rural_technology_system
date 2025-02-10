"use client"

import CustomFormField from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import { FormFieldType } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";

const initialState = {}

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must have 8 or more characters"
    })
})

export default function Page() {

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                email: "",
                password: ""
            },
        })

        async function onSubmit(values: z.infer<typeof formSchema>) {
                const { email, password } = values;
                
            }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-2 p-4">

                <p className="font-bold">Commodity Details</p>

                <div className="grid grid-cols-2 gap-2">
                    <CustomFormField
                    control={form.control}
                        placeholder=""
                        name="commodity"
                        label="Commodity"
                        id="commodity"
                        fieldtype={FormFieldType.INPUT}
                    />
                    <CustomFormField
                    control={form.control}
                        placeholder=""
                        name="variety"
                        label="Variety"
                        id="variety"
                        fieldtype={FormFieldType.INPUT}
                    />
                    <CustomFormField
                        control={form.control}
                        placeholder=""
                        name="grade"
                        label="Grade"
                        id="grade"
                        fieldtype={FormFieldType.NUMBER}
                    />
                    <CustomFormField
                        control={form.control}
                        placeholder=""
                        name="price"
                        label="Price/Kg"
                        id="price"
                        fieldtype={FormFieldType.NUMBER}
                    />
                    <CustomFormField
                        control={form.control}
                        placeholder=""
                        name="grossWeight"
                        label="Gross Weight"
                        id="grossWeight"
                        fieldtype={FormFieldType.NUMBER}
                    />
                    <CustomFormField
                        control={form.control}
                        placeholder=""
                        name="deductions"
                        label="Deductions"
                        id="deductions"
                        fieldtype={FormFieldType.NUMBER}
                    />
                    <CustomFormField
                        control={form.control}
                        placeholder=""
                        name="netWeight"
                        label="Net Weight"
                        id="netWeight"
                        fieldtype={FormFieldType.NUMBER}
                    />
                    <CustomFormField
                        control={form.control}
                        placeholder=""
                        name="moistureIn"
                        label="Moisture In"
                        id="moistureIn"
                        fieldtype={FormFieldType.NUMBER}
                    />
                    <CustomFormField
                        control={form.control}
                        placeholder=""
                        name="noOfBags"
                        label="No of Bags"
                        id="noOfBags"
                        fieldtype={FormFieldType.NUMBER}
                    />
                    <CustomFormField
                        control={form.control}
                        placeholder=""
                        name="bagsReturned"
                        label="Bags Returned"
                        id="bagsReturned"
                        fieldtype={FormFieldType.NUMBER}
                    />
                </div>
                <div className="h-2" />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}