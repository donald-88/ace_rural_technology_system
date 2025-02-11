"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  PlusCircle,
  MinusCircle
} from "lucide-react";
import CustomFormField from "@/components/customFormField";
import { FormFieldType } from "@/lib/types";

interface BagSet {
  id: number;
}

const initialFormValues = {
  receiptNumber: "",
  clientId: "",
  commodity: "",
  variety: "",
  grade: "",
  priceKg: "",
  costProfile: "",
  moisture: "",
  netWeight: "0",
  deductions: "",
  "noOfBags-0": "",
  "grossWeight-0": ""
};

const formSchema = z.object({
  receiptNumber: z.string(),
  clientId: z.string(),
  commodity: z.string(),
  variety: z.string(),
  grade: z.string(),
  priceKg: z.string(),
  costProfile: z.string(),
  moisture: z.string(),
  netWeight: z.string(),
  deductions: z.string(),
}).catchall(z.string());

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const [bagSets, setBagSets] = useState<BagSet[]>([{ id: 1 }]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
    mode: "onChange"
  });

  // Watch specific fields for calculation
  useEffect(() => {
    const fieldsToWatch = bagSets.map((_, index) => [
      `noOfBags-${index}`,
      `grossWeight-${index}`
    ]).flat();

    const subscription = form.watch((value, { name, type }) => {
      // Only calculate if the changed field is one we're watching
      if (type === "change" && fieldsToWatch.includes(name || "")) {
        const formValues = form.getValues();
        let totalWeight = 0;

        bagSets.forEach((_, index) => {
          const grossWeight = parseFloat(formValues[`grossWeight-${index}`] || "0");
          const numberOfBags = parseInt(formValues[`noOfBags-${index}`] || "0");

          if (!isNaN(grossWeight) && !isNaN(numberOfBags)) {
            totalWeight += grossWeight * numberOfBags;
          }
        });

        // Only update if the value has changed
        const currentNetWeight = parseFloat(formValues.netWeight || "0");
        if (currentNetWeight !== totalWeight) {
          form.setValue("netWeight", totalWeight.toString(), {
            shouldValidate: false,
            shouldDirty: false
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [bagSets, form]);

  const addBagSet = () => {
    const newIndex = bagSets.length;
    setBagSets(prev => [...prev, { id: prev.length + 1 }]);

    // Initialize new fields without triggering validation
    form.setValue(`noOfBags-${newIndex}`, "", {
      shouldValidate: false,
      shouldDirty: false
    });
    form.setValue(`grossWeight-${newIndex}`, "", {
      shouldValidate: false,
      shouldDirty: false
    });
  };

  const removeBagSet = (index: number) => {
    setBagSets(prev => {
      const newBagSets = prev.filter((_, i) => i !== index);

      // Unregister removed fields
      form.unregister([`noOfBags-${index}`, `grossWeight-${index}`]);

      // Recalculate total weight
      const formValues = form.getValues();
      let totalWeight = 0;

      newBagSets.forEach((_, i) => {
        const grossWeight = parseFloat(formValues[`grossWeight-${i}`] || "0");
        const numberOfBags = parseInt(formValues[`noOfBags-${i}`] || "0");

        if (!isNaN(grossWeight) && !isNaN(numberOfBags)) {
          totalWeight += grossWeight * numberOfBags;
        }
      });

      form.setValue("netWeight", totalWeight.toString(), {
        shouldValidate: false,
        shouldDirty: false
      });

      return newBagSets;
    });
  };

  const onSubmit = async (values: FormValues) => {
    console.log(values);
  };

  return (
    <section className="flex justify-center w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col sm:grid sm:grid-cols-2 w-full max-w-6xl gap-4 p-4"
        >
          <CustomFormField
            control={form.control}
            name="receiptNumber"
            label="Warehouse Receipt Number"
            placeholder="Enter warehouse receipt number"
            id="receiptNumber"
            fieldtype={FormFieldType.INPUT}
          />

          <CustomFormField
            control={form.control}
            name="clientId"
            label="Client ID"
            placeholder="Enter client ID"
            id="clientId"
            fieldtype={FormFieldType.INPUT}
          />

          <CustomFormField
            control={form.control}
            name="commodity"
            label="Commodity"
            placeholder="Enter commodity"
            id="commodity"
            fieldtype={FormFieldType.SELECT}
          />

          <CustomFormField
            control={form.control}
            name="variety"
            label="Variety"
            placeholder="Enter variety"
            id="variety"
            fieldtype={FormFieldType.SELECT}
          />

          <CustomFormField
            control={form.control}
            name="grade"
            label="Grade"
            placeholder="Enter grade"
            id="grade"
            fieldtype={FormFieldType.NUMBER}
          />

          <CustomFormField
            control={form.control}
            name="priceKg"
            label="Price/Kg"
            placeholder="0 (MKW)"
            id="priceKg"
            fieldtype={FormFieldType.NUMBER}
          />

          <CustomFormField
            control={form.control}
            name="costProfile"
            label="Cost Profile"
            placeholder="Enter cost profile"
            id="costProfile"
            fieldtype={FormFieldType.INPUT}
          />

          <CustomFormField
            control={form.control}
            name="incomingBags"
            label="Incoming Bags"
            placeholder="0"
            id="incomingBags"
            fieldtype={FormFieldType.NUMBER}
            disabled={true}
          />

          <CustomFormField
            control={form.control}
            name="moisture"
            label="Moisture"
            placeholder="0%"
            id="moisture"
            fieldtype={FormFieldType.NUMBER}
          />

          {bagSets.map((set, index) => (
            <div key={set.id} className="col-span-2 flex gap-4">
              <div className="w-full flex items-center gap-4">
                <div className="pt-8">
                {index === 0 ? (
                  <PlusCircle
                    className="cursor-pointer text-primary"
                    onClick={addBagSet}
                  />
                ) : (
                  <MinusCircle
                    className="cursor-pointer text-red-600"
                    onClick={() => removeBagSet(index)}
                  />
                )}
                </div>
                <CustomFormField
                  control={form.control}
                  name={`noOfBags-${index}`}
                  label="Number Of Bags"
                  placeholder="0"
                  id={`noOfBags-${index}`}
                  fieldtype={FormFieldType.NUMBER}
                />
              </div>
              <div className="w-full flex items-center gap-4">
                <CustomFormField
                  control={form.control}
                  name={`grossWeight-${index}`}
                  label="Gross Weight"
                  placeholder="0"
                  id={`grossWeight-${index}`}
                  fieldtype={FormFieldType.NUMBER}
                />
              </div>
            </div>
          ))}

          <CustomFormField
            control={form.control}
            name="netWeight"
            label="Net Weight"
            placeholder="0"
            id="netWeight"
            fieldtype={FormFieldType.INPUT}
            disabled={true}
          />

          <CustomFormField
            control={form.control}
            name="deductions"
            label="Deductions"
            placeholder="0"
            id="deductions"
            fieldtype={FormFieldType.NUMBER}
          />

          <Button className="col-span-2" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}