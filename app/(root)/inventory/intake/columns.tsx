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
import { IntakeType } from "@/types";
import { deleteIntakeItemsAction } from "./actions";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useToast } from "@/hooks/use-toast";

const deleteInventory = async (id: string) => {
  const { toast } = useToast()
  const deletedIntake = await deleteIntakeItemsAction([id]);

  if (deletedIntake.success) {
    toast({ title: 'Success', description: 'Intake deleted successfully' })
  } else {
    toast({ title: 'Error', description: 'Error deleting intake' })
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
    accessorKey: "intakeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intake ID" />
    ),
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client" />
    ),
  },
  {
    accessorKey: "commodity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commodity" />
    ),
  },
  {
    accessorKey: "variety",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variety" />
    ),
  },
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price/Kg" />
    ),
  },
  {
    accessorKey: "moistureIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moisture In" />
    ),
  },
  {
    accessorKey: "bagIds",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bags" />
    ),
    cell: ({ row }) => {
      const bagIds = row.getValue("bagIds") as string[]; // Assuming it's an array of strings
      return <div>{bagIds.length}</div>;
    },
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
              onClick={() => navigator.clipboard.writeText(intake.intakeId)}
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
                    <SheetTitle>Intake {intake.intakeId}</SheetTitle>
                    <SheetDescription>
                      {/* <InventoryDetails inventoryEntry={intake} /> */}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => deleteInventory(intake.intakeId)}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
