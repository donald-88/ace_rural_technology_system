"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { deleteDispatchItemAction } from "./actions";
import { toast } from "sonner";
import { IntakeType } from "@/types";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import InventoryDetails from "../details";

const deleteInventory = async (id: string) => {
  const deletedIntake = await deleteDispatchItemAction(id);

  if (deletedIntake.success) {
    toast.success("Intake deleted successfully");
  } else {
    toast.error("Error deleting intake");
  }
};

export const columns: ColumnDef<IntakeType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "id",
    header: "Dispatch ID",
  },
  {
    accessorKey: "client_ids",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          C ID
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const customerIDs = row.getValue("client_ids") as string[]; // Assuming it's an array of strings
      if (!customerIDs || customerIDs.length === 0) {
        return <div className="text-gray-500">No IDs</div>;
      }

      return (
        <div className="flex flex-col space-y-1">
          {customerIDs.map((id, index) => (
            <span key={index} className="truncate">
              {id}
            </span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "commodity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          Commodity
          <ChevronsUpDown size={16} />
        </Button>
      )
    },
  },
  {
    accessorKey: "variety",
    header: "Variety",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "price",
    header: "Price/Kg",
  },
  {
    accessorKey: "moisture_in",
    header: "Moisture In",
  },
  {
    accessorKey: "number_of_bags",
    header: "No of Bags",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          Date
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const rawDate = row.getValue("createdAt") as string;

      // Handle invalid or null/undefined dates
      if (!rawDate) {
        return <div className="text-gray-500">No Date</div>;
      }

      try {
        // Create a valid date object
        const formattedDate = new Date(rawDate).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return <div className="font-medium text-left">{formattedDate}</div>;
      } catch (error) {
        console.error("Invalid date:", rawDate, error);
        return <div className="text-red-500">Invalid Date</div>;
      }
    },
  },
  {
    header: "Edit",
    id: "actions",
    cell: ({ row }) => {
      const dispatch = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(dispatch.id)}
            >
              Copy Intake ID
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="w-full flex justify-start p-0 font-normal">
                    View Details
                  </button>
                </SheetTrigger>
                <SheetContent className="w-[700px] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Dispatch {dispatch.id}</SheetTitle>
                    <SheetDescription>
                      <InventoryDetails inventoryEntry={dispatch} />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteInventory(dispatch.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
