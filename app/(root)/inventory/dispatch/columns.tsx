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
import { deleteDispatchItemAction } from "./actions";
import { toast } from "sonner";
import { DispatchType } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

const deleteInventory = async (id: string) => {
  const deletedIntake = await deleteDispatchItemAction([id]);

  if (deletedIntake.success) {
    toast.success("Intake deleted successfully");
  } else {
    toast.error("Error deleting intake");
  }
};

export const columns: ColumnDef<DispatchType>[] = [
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
    accessorKey: "dispatchId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dispatch ID" />
    ),
  },
  {
    accessorKey: "intakeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intake ID" />
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
      <DataTableColumnHeader column={column} title="Price" />
    ),
  },
  {
    accessorKey: "moistureIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Moisture In" />
    ),
  },
  {
    accessorKey: "bagCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bag Count" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const rawDate = row.getValue("createdAt") as string;

      if (!rawDate) {
        return <div className="text-gray-500">No Date</div>;
      }

      try {
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(dispatch.dispatchId)}
            >
              Copy Dispatch ID
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
                    <SheetTitle>Dispatch {dispatch.dispatchId}</SheetTitle>
                    <SheetDescription>
                      {/* <InventoryDetails inventoryEntry={dispatch} /> */}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => deleteInventory(dispatch.intakeId)}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
