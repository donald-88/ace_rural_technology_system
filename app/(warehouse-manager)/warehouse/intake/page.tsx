"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormFieldType } from "@/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  PlusCircle,
  MinusCircle,
  Warehouse,
  Cctv,
  ArrowDownCircle,
  Weight,
  DollarSign,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const initialState = {};

const formSchema = z.object({
  email: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  password: z
    .string()
    .min(8, { message: "Password must have 8 or more characters" }),
});

export default function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function addBagSet() {
    setBagSets([...bagSets, { id: bagSets.length + 1 }]);
  }

  function removeBagSet(index: number) {
    setBagSets(bagSets.filter((_, i) => i !== index));
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center w-full px-4 pt-8"
      >
        {/* Warehouse Receipt Number */}
        <div className="flex flex-col w-[700px]">
          <p className="flex items-center gap-2 p-2">
            <Warehouse className="w-5 h-5 text-gray-600" />
            Warehouse Receipt Number
          </p>
          <Input
            type="text"
            placeholder="Enter receipt number"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Client ID */}
        <div className="flex flex-col w-[700px] mt-4">
          <p className="flex items-center gap-2 p-2">
            <Cctv className="w-5 h-5 text-gray-600" />
            Client ID
          </p>
          <Input
            type="text"
            placeholder="Enter client ID"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Commodity */}
        <div className="flex flex-col w-[700px] mt-4">
          <p className="flex items-center gap-2 p-2">
            <ArrowDownCircle className="w-5 h-5 text-gray-600" />
            Commodity
          </p>
          <Input
            type="text"
            placeholder="Enter commodity"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Variety */}
        <div className="flex flex-col w-[700px] mt-4">
          <p className="flex items-center gap-2 p-2">
            <Weight className="w-5 h-5 text-gray-600" />
            Variety
          </p>
          <Input
            type="text"
            placeholder="Enter variety"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Grade */}
        <div className="flex flex-col w-[700px] mt-4">
          <p className="flex items-center gap-2 p-2">
            <Warehouse className="w-5 h-5 text-gray-600" />
            Grade
          </p>
          <Input
            type="number"
            placeholder="Enter grade"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Price/Kg */}
        <div className="flex flex-col w-[700px] mt-4">
          <p className="flex items-center gap-2 p-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            Price/Kg
          </p>
          <Input
            type="number"
            placeholder="Enter price per Kg"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Deductions */}
        <div className="flex flex-col w-[700px] mt-4">
          <p className="flex items-center gap-2 p-2">
            <ArrowDownCircle className="w-5 h-5 text-gray-600" />
            Deductions
          </p>
          <Input
            type="number"
            placeholder="Enter deductions"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Net Weight */}
        <div className="flex flex-col w-[700px] mt-4">
          <p className="flex items-center gap-2 p-2">
            <Weight className="w-5 h-5 text-gray-600" />
            Net Weight
          </p>
          <Input
            type="number"
            placeholder="Enter net weight"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Moisture In */}
        <div className="flex flex-col w-[700px] mt-4">
          <p className="flex items-center gap-2 p-2">
            <Cctv className="w-5 h-5 text-gray-600" />
            Moisture In
          </p>
          <Input
            type="number"
            placeholder="Enter moisture percentage"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Bags Section */}
        {bagSets.map((set, index) => (
          <div key={set.id} className="flex gap-4 items-center w-[700px] mt-4">
            <div className="flex flex-col w-[350px]">
              <label className="text-sm text-gray-600 mb-1">
                Number of Bags
              </label>
              <Input
                type="number"
                placeholder="Enter number"
                className="border rounded-md p-2 w-full"
              />
            </div>
            <div className="flex flex-col w-[350px]">
              <label className="text-sm text-gray-600 mb-1">
                Gross Weight per Bag
              </label>
              <Input
                type="number"
                placeholder="Enter weight"
                className="border rounded-md p-2 w-full"
              />
            </div>
            {index > 0 && (
              <MinusCircle
                className="cursor-pointer text-red-600"
                onClick={() => removeBagSet(index)}
              />
            )}
          </div>
        ))}

        {/* Add Bag Set Button */}
        <div className="h-4 mt-4">
          <PlusCircle className="cursor-pointer" onClick={addBagSet} />
        </div>

        {/* Submit Button */}
        <div className="h-2" />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
