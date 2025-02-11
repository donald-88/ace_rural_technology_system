"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/customFormField";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormFieldType } from "@/lib/types";
import { Form } from "@/components/ui/form";

interface BagSet {
  id: number;
}

const initialFormValues = {
  recordingNumber: "",
  moisture: "",
  netWeight: "0",
  deductions: "",
  "noOfBags-0": "",
  "grossWeight-0": ""
};

const formSchema = z.object({
  recordingNumber: z.string(),
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
        <form className="flex flex-col sm:grid sm:grid-cols-2 w-full max-w-5xl gap-4 p-4" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Warehouse ID */}
          <CustomFormField
            control={form.control}
            name="recordingReceipt"
            label="Recording Receipt Number"
            placeholder="Enter recording receipt number"
            id="recordingNumber"
            fieldtype={FormFieldType.INPUT}
          />

          {/* No. of Bags */}
          <CustomFormField
            control={form.control}
            name="noOfBags"
            label="Number of Bags"
            placeholder="0"
            id="noOfBags"
            fieldtype={FormFieldType.INPUT}
            disabled={true}
          />

          {/* Deductions Section */}
          {bagSets.map((set, index) => (
            <div key={set.id} className="col-span-2 items-center flex gap-4">
              <div className="w-full flex items-center gap-4">
                {index === 0 ? (
                  <PlusCircle
                    size={24}
                    className="cursor-pointer text-primary"
                    onClick={addBagSet}
                  />
                ) : (
                  <MinusCircle
                    className="cursor-pointer text-red-600"
                    onClick={() => removeBagSet(index)}
                  />
                )}
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

          {/* Net Weight */}
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
            name="moisture"
            label="Moisture"
            placeholder="0%"
            id="moisture"
            fieldtype={FormFieldType.INPUT}
          />

          <CustomFormField
            control={form.control}
            name="deductions"
            label="Deductions"
            placeholder="0"
            id="deductions"
            fieldtype={FormFieldType.NUMBER}
          />

          {/* Submit Button */}
          <Button type="submit" className="col-span-2">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}
