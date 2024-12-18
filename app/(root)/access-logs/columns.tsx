"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Access = {
  id: string;
  name: string;
  otp: string;
  reason: string;
  role: string;
  date: string;
  timeOfEntry: string;
  timeOFExit: string;
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
    accessorKey: "time_of_exit",
    header: "Time of Exit",
    cell: ({ row }) => {
      const date = row.getValue("time_of_exit") as string;
      const formatted = new Date(date).toLocaleTimeString();
      return <div className="font-medium text-left">{formatted}</div>;
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const intake = row.original;

      function deleteInventory($id: any): void {
        throw new Error("Function not implemented.");
      }

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

            <DropdownMenuItem>Accept</DropdownMenuItem>
            <DropdownMenuItem>Decline</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
