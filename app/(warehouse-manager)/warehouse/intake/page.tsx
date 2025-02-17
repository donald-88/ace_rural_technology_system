"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { PlusCircle, MinusCircle } from "lucide-react";
import CustomFormField from "@/components/customFormField";
import { FormFieldType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { intakeFormSchema, type intakeFormData } from "@/lib/validation";

export default function Page() {
  const { toast } = useToast()

  const form = useForm<intakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      warehouseReceiptNumber: "",
      grade: 0,
      costProfile: "",
      incomingBags: 0,
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

  const resetForm = () => {
    form.reset()
  }

  function onSubmit(data: intakeFormData) {
    toast({
      title: "Dispatch created successfully",
      description: "Your dispatch has been created successfully.",
    })
  }

  return (
    <section className="flex justify-center w-full">
      <div className="w-1/3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 p-4"
          >
            <CustomFormField
              control={form.control}
              name="warehouseReceiptNumber"
              label="Warehouse Receipt Number"
              placeholder="Enter warehouse receipt number"
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
              disabled={true}
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
      </div>
      <div className="flex w-1/3 justify-end gap-2">
        <p>Yo</p>
      </div>
    </section>
  );
}