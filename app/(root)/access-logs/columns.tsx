"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Access } from "@/db/schema/access";


export const columns: ColumnDef<Access>[] = [
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
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "otp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OTP" />
    ),
  },

  {
    accessorKey: "deviceId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Device ID" />
    ),
  },

  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Generated Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatted = new Date(date).toLocaleDateString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
];
