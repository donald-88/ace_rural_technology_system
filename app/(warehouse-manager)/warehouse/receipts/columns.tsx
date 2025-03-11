"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { WarehouseReceipt } from "@/db/schema/warehouse-receipt";


export function getColumns(): ColumnDef<WarehouseReceipt>[] {
  return [{
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
      <DataTableColumnHeader column={column} title="WHR" />
    ),
  },
  {
    accessorKey: "holder",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Holder" />
    ),
  },
  {
    accessorKey: "commodityGroup",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commodity Group" />
    ),
  },
  {
    accessorKey: "commodityVariety",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Commodity Variety" />
    ),
  },
  
  {
    accessorKey: "grade",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Grade" />
    ),
  },
  {
    accessorKey: "warehouse_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Warehouse" />
    ),
  },
  {
    accessorKey: "cropSeason",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Season" />
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
  }
  ]
}
