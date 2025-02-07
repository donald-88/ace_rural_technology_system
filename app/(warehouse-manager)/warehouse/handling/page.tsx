"use client";

import { useState } from "react";
import {
  ImportIcon,
  PlusCircle,
  MinusCircle,
  Warehouse,
  Cctv,
  Weight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [inputFields, setInputFields] = useState<
    { bags: string; weight: string }[]
  >([{ bags: "", weight: "" }]);

  // Function to add a new input field row
  const addInputField = () => {
    setInputFields([...inputFields, { bags: "", weight: "" }]);
  };

  // Function to remove an input field row
  const removeInputField = (index: number) => {
    setInputFields((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  // Function to handle numeric input validation
  const handleInputChange = (
    index: number,
    field: "bags" | "weight",
    value: string
  ) => {
    if (/^\d*$/.test(value)) {
      // Allow only numbers
      setInputFields((prevFields) =>
        prevFields.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", inputFields);
  };

  return (
    <section className="px-4 pt-8 h-full w-full flex flex-col items-center gap-4">
      <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
        {/* Warehouse ID */}
        <div className="flex flex-col w-[700px]">
          <p className="flex items-center gap-2 p-2">
            <Warehouse className="w-5 h-5 text-gray-600" />
            Warehouse Id
          </p>
          <Input
            type="text"
            placeholder="Enter id"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* No. of Bags */}
        <div className="flex flex-col w-[700px]">
          <p className="flex items-center gap-2 p-2">
            <Cctv className="w-5 h-5 text-gray-600" />
            No. of Bags
          </p>
          <Input
            type="text"
            placeholder="Enter number"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Deductions Section */}
        <div className="flex flex-col items-center w-[700px] ml-4">
          <p className="flex items-center gap-2 p-2">
            <ImportIcon className="w-5 h-5 text-gray-600" />
            Deductions
          </p>
          {inputFields.map((field, index) => (
            <div key={index} className="flex gap-4 mb-2 items-center">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">No. of Bags</label>
                <Input
                  type="number"
                  placeholder="Enter number"
                  value={field.bags}
                  onChange={(e) =>
                    handleInputChange(index, "bags", e.target.value)
                  }
                  className="border rounded-md p-2 w-[350px]"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Weight</label>
                <Input
                  type="number"
                  placeholder="Enter weight"
                  value={field.weight}
                  onChange={(e) =>
                    handleInputChange(index, "weight", e.target.value)
                  }
                  className="border rounded-md p-2 w-[350px]"
                />
              </div>
              {index > 0 && (
                <MinusCircle
                  className="w-6 h-6 text-red-600 cursor-pointer mt-6"
                  onClick={() => removeInputField(index)}
                />
              )}
            </div>
          ))}
          <PlusCircle
            className="w-6 h-6 text-gray-600 cursor-pointer mt-2"
            onClick={addInputField}
          />
        </div>

        {/* Net Weight */}
        <div className="flex flex-col w-[700px]">
          <p className="flex items-center gap-2 p-2">
            <Weight className="w-5 h-5 text-gray-600" />
            Net Weight
          </p>
          <Input
            type="text"
            placeholder="Enter Net weight"
            className="border rounded-md p-2 w-full"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="mt-4 w-[200px]">
          Submit
        </Button>
      </form>
    </section>
  );
}
