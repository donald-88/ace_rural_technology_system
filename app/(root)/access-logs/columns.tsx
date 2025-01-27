"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Circle, CircleCheck, CircleX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AccessType } from "@/types";
import { CaretSortIcon } from "@radix-ui/react-icons";


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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          OTP
          <CaretSortIcon />
        </Button>
      );
    },
  },

  {
    accessorKey: "deviceId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          Device ID
          <CaretSortIcon />
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
          className="flex p-1"
        >
          Role
          <CaretSortIcon />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          Date
          <CaretSortIcon />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      const formatted = new Date(date).toLocaleDateString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Time of Entry",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
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
          status === "Approved" ? (<div className="flex items-center gap-1 bg-primary-foreground text-primary text-xs p-1 rounded-sm">
            <CircleCheck size={12} />
            <p>Approved</p>
          </div>) : status === "Pending" ? (<div className="flex items-center gap-1 bg-amber-100 text-amber-600 text-xs p-1 rounded-sm">
            <Circle size={12} />
            <p>Pending</p>
          </div>
          ) : status === "Denied" && (<div className="flex items-center gap-1 bg-red-100 text-red-600 text-xs p-1 rounded-sm">
            <CircleX size={12} />
            <p>Denied</p>
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
