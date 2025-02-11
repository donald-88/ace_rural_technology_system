"use client"

import CustomFormField from "@/components/customFormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFieldType } from "@/lib/types";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface BagSet {
  id: number;
}

const initialFormValues = {
  drawdownId: "",
  moisture: "",
  netWeight: "0",
  deductions: "",
  "noOfBags-0": "",
  "grossWeight-0": ""
};

const formSchema = z.object({
  drawdownId: z.string(),
  moisture: z.string(),
  netWeight: z.string(),
  deductions: z.string(),
}).catchall(z.string());

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const [bagSets, setBagSets] = useState<BagSet[]>([{ id: 1 }]);

  const form = useForm<FormValues>({
    defaultValues: initialFormValues,
    mode: "onChange"
  });

  const calculateTotalWeight = (formValues: FormValues, bags: BagSet[]) => {
    return bags.reduce((total, _, index) => {
      const grossWeight = parseFloat(formValues[`grossWeight-${index}`] || "0");
      const numberOfBags = parseInt(formValues[`noOfBags-${index}`] || "0");

      if (!isNaN(grossWeight) && !isNaN(numberOfBags)) {
        return total + (grossWeight * numberOfBags);
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    const fieldsToWatch = bagSets.map((_, index) => [
      `noOfBags-${index}`,
      `grossWeight-${index}`
    ]).flat();

    const subscription = form.watch((value, { name, type }) => {
      if (type === "change" && fieldsToWatch.includes(name || "")) {
        const formValues = form.getValues();
        const totalWeight = calculateTotalWeight(formValues, bagSets);

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
      form.unregister([`noOfBags-${index}`, `grossWeight-${index}`]);

      const formValues = form.getValues();
      const totalWeight = calculateTotalWeight(formValues, newBagSets);

      form.setValue("netWeight", totalWeight.toString(), {
        shouldValidate: false,
        shouldDirty: false
      });

      return newBagSets;
    });
  };

  const onSubmit = (values: FormValues) => {
    try {
      console.log(values);
      // Handle your form submission here
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <section className="flex justify-center w-full">
      <Form {...form}>
        <form className="flex flex-col sm:grid sm:grid-cols-2 w-full max-w-5xl gap-4 p-4" onSubmit={form.handleSubmit(onSubmit)}>
          <CustomFormField
            control={form.control}
            name="drawdownId"
            label="Drawdown ID"
            placeholder="Enter Drawdown ID"
            id="drawdownId"
            fieldtype={FormFieldType.INPUT}
          />

          <CustomFormField
            control={form.control}
            name="noOfBags"
            label="Number of Bags"
            placeholder="0"
            id="noOfBags"
            fieldtype={FormFieldType.NUMBER}
            disabled={true}
          />

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

          <CustomFormField
            control={form.control}
            name="netWeight"
            label="Net Weight"
            placeholder="0"
            id="netWeight"
            fieldtype={FormFieldType.NUMBER}
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

          <Button type="submit" className="col-span-2">
            Submit
          </Button>
        </form>
      </Form>
    </section>
  );
}