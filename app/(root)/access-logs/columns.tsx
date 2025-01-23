"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown, Circle, CircleCheck, CircleX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export type Access = {
  id: string;
  name: string;
  otp: string;
  reason: string;
  role: string;
  date: string;
  timeOfEntry: string;
  status: string;
};

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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "otp",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          OTP
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
  },

  {
    accessorKey: "device_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Device ID
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
  },

  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          Date
          <ChevronsUpDown size={16} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("datetime") as string;
      const formatted = new Date(date).toLocaleDateString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "datetime",
    header: "Time of Entry",
    cell: ({ row }) => {
      const date = row.getValue("datetime") as string;
      const formatted = new Date(date).toLocaleTimeString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <>
        {
          status === "granted" ? (<div className="flex items-center gap-1 bg-primary-foreground text-primary text-xs p-1 rounded-md">
            <CircleCheck size={12} />
            <p>Accepted</p>
          </div>) : status === "pending" ? (<div className="flex items-center gap-1 bg-amber-100 text-amber-600 text-xs p-1 rounded-md">
            <Circle size={12} />
            <p>Pending</p>
          </div>
          ) : status === "declined" && (<div className="flex items-center gap-1 bg-error-foreground text-error text-xs p-1 rounded-md">
            <CircleX size={12} />
            <p>Declined</p>
          </div>)
        }</>
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
            <DropdownMenuItem disabled={accessLog.status != "pending"}>
              Accept
            </DropdownMenuItem>
            <DropdownMenuItem disabled={accessLog.status != "pending"}>Decline</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
