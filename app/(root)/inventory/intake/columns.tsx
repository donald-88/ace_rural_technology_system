"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { deleteIntakeItemsAction } from "./actions";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useToast } from "@/hooks/use-toast";
import { Deposit } from "@/db/schema/deposit";

const deleteInventory = async (id: string) => {
  const { toast } = useToast()
  const deletedIntake = await deleteIntakeItemsAction([id]);

  if (deletedIntake.success) {
    toast({ title: 'Success', description: 'Intake deleted successfully' })
  } else {
    toast({ title: 'Error', description: 'Error deleting intake' })
  }
};

export const columns: ColumnDef<Deposit>[] = [
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intake ID" />
    ),
  },
  {
    accessorKey: "holder",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
  },
  {
    accessorKey: "commodityVariety",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commodity" />
    ),
  },
  {
    accessorKey: "costProfile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cost Profile" />
    ),
  },
  {
    accessorKey: "incomingBags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No Of Bags" />
    ),
  },
  {
    accessorKey: "netWeight",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Weight" />
    ),
  },
  {
    accessorKey: "moisture",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moisture In" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
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
      const intake = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(intake.id)}
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
                    <SheetTitle>Intake {intake.id}</SheetTitle>
                    <SheetDescription>
                      {/* <InventoryDetails inventoryEntry={intake} /> */}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => deleteInventory(intake.id)}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
