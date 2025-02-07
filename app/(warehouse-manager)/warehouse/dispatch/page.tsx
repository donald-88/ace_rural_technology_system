import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getDispatchById } from "@/lib/actions/dispatch.actions";
import Link from "next/link";
import { ReceiptTextIcon, Cctv, Filter } from "lucide-react";

export default async function Page() {

  return (
    <section className="px-4 pt-8 h-full w-full flex flex-col items-center gap-2">
      <div className="flex gap-6 mb-4">
        {/* Warehouse Receipt Code */}
        <div className="flex flex-col">
          <p className="flex items-center gap-4 text-sm font-small p-4">
            <ReceiptTextIcon className="w-5 h-5 text-gray-600" />
            Warehouse Receipt - Code
          </p>
          <div className="relative w-[350px]">
            {/* Input Field */}
            <Input
              type="text"
              placeholder="Enter code"
              className="border rounded-md p-2 w-full h-10 pr-10"
            />

            {/* Filter Icon inside Input (Right) */}
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* Number of Bags (Output Field) */}
        <div className="flex flex-col">
          <p className="flex items-center gap-4 text-sm font-small p-4">
            <Cctv className="w-5 h-5 text-gray-600" />
            Number of Bags
          </p>
          <output className="border rounded-md p-2 w-[350px] h-10 bg-gray-100 flex items-center">
            0 {/* Replace 0 with dynamic value */}
          </output>
        </div>
      </div>
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-muted-foreground">
            No handling results were found
          </p>
        </div>
    </section>
  );
}
