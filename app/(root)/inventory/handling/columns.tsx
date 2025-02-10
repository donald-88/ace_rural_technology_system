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
import { deleteHandlingItemAction } from "./actions";
import { toast } from "sonner";
import { HandlingType } from "@/types"; // Assuming HandlingType is correctly imported
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
  const deletedIntake = await deleteHandlingItemAction([id]);

  if (deletedIntake.success) {
    toast.success("Intake deleted successfully");
  } else {
    toast.error("Error deleting intake");
  }
};

export const columns: ColumnDef<HandlingType>[] = [
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
    accessorKey: "handlingId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Handling ID" />
    ),
  },
  {
    accessorKey: "intakeId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intake ID" />
    )
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
    accessorKey: "netWeight",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Net Weight" />
    ),
  },
  {
    accessorKey: "bagsOut",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bags Out" />
    ),
  },
  {
    accessorKey: "bagsIn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bags In" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
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
      const handler = row.original;

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
              onClick={() => navigator.clipboard.writeText(handler.handlingId)}
            >
              Copy Handling ID
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
                    <SheetTitle>Handling {handler.handlingId}</SheetTitle>
                    <SheetDescription>
                      {/* <InventoryDetails inventoryEntry={handler} /> */}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => deleteInventory(handler.intakeId)}>
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
