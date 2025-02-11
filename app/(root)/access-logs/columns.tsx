"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
import { AccessType } from "@/types";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";


export const columns: ColumnDef<AccessType>[] = [
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
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatted = new Date(date).toLocaleDateString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "timeOfEntry",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time of Entry" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatted = new Date(date).toLocaleTimeString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <div className="w-fit">
        {
          status === "Approved" ? (
          <Badge className="font-medium capitalize flex gap-1.5">
            <CheckIcon />
            <p>Approved</p>
          </Badge>
        ) : status === "Pending" ? (
        <Badge className="flex gap-1.5 font-medium bg-yellow-100 text-yellow-600">
            <Circle size={12} />
            <p>Pending</p>
          </Badge>
          ) : status === "Denied" && (
          <Badge className="flex gap-1.5 font-medium bg-red-100 text-red-600">
            <Cross2Icon />
            <p>Denied</p>
          </Badge>)
        }</div>
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const accessLog = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem disabled={accessLog.status != "Pending"}>
              Accept
            </DropdownMenuItem>
            <DropdownMenuItem disabled={accessLog.status != "Pending"}>Decline</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
