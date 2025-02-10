"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { User } from "better-auth";


export const columns: ColumnDef<User>[] = [
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
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={row.original.name} />
            <AvatarFallback className="bg-primary-foreground text-primary font-medium">{getInitials(name)}</AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      );
    }
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          Email
          <CaretSortIcon />
        </Button>
      );
    },
  },

  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1"
        >
          Phone
          <CaretSortIcon />
        </Button>
      );
    },
  },
  {
    accessorKey: 'emailVerified',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex p-1">
          Verified
        </Button>
      )
    },
    cell: ({ row }) => {
      const verified = row.getValue("emailVerified") as boolean;
      return (
        <Badge variant={verified ? "default" : "destructive"} className="capitalize font-medium">
          {verified.toString()}
        </Badge>
      );
    }
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
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <p className="capitalize">{role}</p>
      );
    }
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
          Date Added
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
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("banned") as boolean;
      return <div>
        {
          status ? (
            <Badge variant="destructive" className="capitalize font-medium">
              Banned
            </Badge>
          ) : (
            <Badge variant="default" className="capitalize font-medium">
              Active
            </Badge>
          )
        }
      </div>

    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const accessLog = row.original;

      console.log(accessLog);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Ban</DropdownMenuItem>
            <DropdownMenuItem>Revoke session</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Remove
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
