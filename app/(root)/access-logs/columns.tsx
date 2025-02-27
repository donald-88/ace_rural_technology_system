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
    accessorKey: "userId",
    header: "Name",
  },
  {
    accessorKey: "otp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OTP" />
    ),
  },

  {
    accessorKey: "lockId",
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
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatted = new Date(date).toLocaleDateString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const accessLog = row.original;

      return (
        <div></div>
        // <DropdownMenu>
        //   <DropdownMenuTrigger asChild>
        //     <Button variant="ghost" className="h-8 w-8 p-0">
        //       <span className="sr-only">Open menu</span>
        //       <MoreHorizontal className="h-4 w-4" />
        //     </Button>
        //   </DropdownMenuTrigger>
        //   <DropdownMenuContent align="end">
        //     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //     <DropdownMenuItem disabled={accessLog. != "Pending"}>
        //       Accept
        //     </DropdownMenuItem>
        //     <DropdownMenuItem disabled={accessLog.status != "Pending"}>Decline</DropdownMenuItem>
        //   </DropdownMenuContent>
        // </DropdownMenu>
      );
    },
  },
];
