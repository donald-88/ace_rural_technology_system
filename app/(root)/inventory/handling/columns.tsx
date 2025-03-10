"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Handling } from "@/db/schema/handling";


export function getColumns(): ColumnDef<Handling>[] {
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
      accessorKey: "warehouseReceiptNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="WHR" />
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Handling ID" />
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
      accessorKey: "noOfBags",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bags" />
      ),
    },
    {
      accessorKey: "netWeight",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Net Weight" />
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
  ]
}
