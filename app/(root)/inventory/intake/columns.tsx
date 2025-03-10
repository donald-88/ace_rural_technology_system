"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { InventoryItemType } from "@/types";

export function getColumns(): ColumnDef<InventoryItemType>[] {
  return [
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
    accessorKey: "depositId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Intake ID" />
    ),
  },
  {
    accessorKey: "depositorId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Depositor" />
    ),
  },
  {
    accessorKey: "commodityGroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commodity" />
    ),
  },
  {
    accessorKey: "commodityVariety",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Variety" />
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
    }
  }
]
    };
