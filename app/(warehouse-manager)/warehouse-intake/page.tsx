"use client"

import CustomFormField from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import { FormFieldType } from "@/lib/types";
import { useFormState } from "react-dom";
import { createIntakeAction } from "./actions";

const initialState = {}

export default function Page() {
    const [state, formAction] = useFormState(createIntakeAction, initialState)
    console.log(state)

    return (
        <form action={formAction} className="grid gap-2 p-4">

            <p className="font-bold">Depositors Details</p>

            <div className="grid grid-cols-2 gap-2">
                <CustomFormField
                    placeholder=""
                    name="name"
                    label="Customer Name"
                    id="name"
                    fieldtype={FormFieldType.INPUT} />
                <CustomFormField
                    placeholder=""
                    name="phone"
                    label="Phone Number"
                    id="phone"
                    fieldtype={FormFieldType.INPUT}
                />
                <CustomFormField
                    placeholder=""
                    name="address"
                    label="Address"
                    id="address"
                    fieldtype={FormFieldType.INPUT}
                />
                <CustomFormField
                    placeholder=""
                    name="bank"
                    label="Bank Name"
                    id="bank"
                    fieldtype={FormFieldType.SELECT}
                    options={['Standard Bank', 'National Bank', 'FDH Bank', 'First Capital Bank', 'NBS Bank', 'Centenary Bank', 'Ecobank']}
                />
                <CustomFormField
                    placeholder=""
                    name="accountName"
                    label="Account Name"
                    id="accountName"
                    fieldtype={FormFieldType.INPUT}
                />
                <CustomFormField
                    placeholder=""
                    name="accountNumber"
                    label="Account Number"
                    id="accountNumber"
                    fieldtype={FormFieldType.NUMBER}
                />
                <CustomFormField
                    placeholder=""
                    name="amount"
                    label="Amount"
                    id="amount"
                    fieldtype={FormFieldType.NUMBER}
                />
            </div>

            <div className="h-2" />

            <p className="font-bold">Commodity Details</p>

            <div className="grid grid-cols-2 gap-2">
                <CustomFormField
                    placeholder=""
                    name="commodity"
                    label="Commodity"
                    id="commodity"
                    fieldtype={FormFieldType.INPUT}
                />
                <CustomFormField
                    placeholder=""
                    name="variety"
                    label="Variety"
                    id="variety"
                    fieldtype={FormFieldType.INPUT}
                />
                <CustomFormField
                    placeholder=""
                    name="grade"
                    label="Grade"
                    id="grade"
                    fieldtype={FormFieldType.NUMBER}
                />
                <CustomFormField
                    placeholder=""
                    name="price"
                    label="Price/Kg"
                    id="price"
                    fieldtype={FormFieldType.NUMBER}
                />
                <CustomFormField
                    placeholder=""
                    name="grossWeight"
                    label="Gross Weight"
                    id="grossWeight"
                    fieldtype={FormFieldType.NUMBER}
                />
                <CustomFormField
                    placeholder=""
                    name="deductions"
                    label="Deductions"
                    id="deductions"
                    fieldtype={FormFieldType.NUMBER}
                />
                <CustomFormField
                    placeholder=""
                    name="netWeight"
                    label="Net Weight"
                    id="netWeight"
                    fieldtype={FormFieldType.NUMBER}
                />
                <CustomFormField
                    placeholder=""
                    name="moistureIn"
                    label="Moisture In"
                    id="moistureIn"
                    fieldtype={FormFieldType.NUMBER}
                />
                <CustomFormField
                    placeholder=""
                    name="noOfBags"
                    label="No of Bags"
                    id="noOfBags"
                    fieldtype={FormFieldType.NUMBER}
                />
                <CustomFormField
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
    )
}