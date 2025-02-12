"use client";

import {
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/customFormField";
import { FormFieldType } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { handlingFormSchema, type handlingFormData } from "@/lib/validation";
import { Input } from "@/components/ui/input";


export default function Page() {

  const { toast } = useToast()

  const form = useForm<handlingFormData>({
    resolver: zodResolver(handlingFormSchema),
    defaultValues: {
      recordingReceipt: "",
      outgoingBags: 0,
      bagEntries: [{ numberOfBags: 0, grossWeight: 0 }],
      moisture: 0,
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

  function onSubmit(data: handlingFormData) {
    toast({
      title: "Dispatch created successfully",
      description: "Your dispatch has been created successfully.",
    })
  }

  return (
    <section className="flex justify-center w-full">
      <Form {...form}>
        <form className="flex flex-col w-full max-w-2xl gap-4 p-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Warehouse ID */}
          <CustomFormField
            control={form.control}
            name="recordingReceipt"
            label="Recording Receipt Number"
            placeholder="Enter recording receipt number"
            fieldtype={FormFieldType.INPUT}
          />

          {/* No. of Bags */}
          <CustomFormField
            control={form.control}
            name="noOfBags"
            label="Number of Bags"
            placeholder="0"
            fieldtype={FormFieldType.INPUT}
            disabled={true}
          />

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

          <CustomFormField
            control={form.control}
            name="moisture"
            label="Moisture"
            placeholder="0%"
            fieldtype={FormFieldType.NUMBER}
          />

          <CustomFormField
            control={form.control}
            name="deductions"
            label="Deductions (%)"
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
            <Button variant={"outline"} className="col-span-2">
              Reset Form
            </Button>
            <Button type="submit" className="col-span-2">
              Handling
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
