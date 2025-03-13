"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Access } from "@/db/schema/access";
import { Badge } from "@/components/ui/badge";


export function getColumns(): ColumnDef<Access>[] {
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
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
    },
    {
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
    },

    {
      accessorKey: "lockId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Lock ID" />
      ),
    },
    {
      id: "endDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const endDate = row.getValue("endDate") as string;
        const isExpired = endDate ? new Date(endDate) < new Date() : false;

        return isExpired ? (
          <Badge variant="destructive" className="font-medium">
            Expired
          </Badge>
        ) : (
          <Badge className="font-medium">
            Active
          </Badge>
        );
      },
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
}
