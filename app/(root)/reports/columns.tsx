"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { IntakeType } from "@/types"
import { CaretSortIcon } from "@radix-ui/react-icons"

export const columns: ColumnDef<IntakeType>[] = [
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
        accessorKey: "customerID",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex p-1"
                >
                    Client
                    <CaretSortIcon />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("clientName")}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "commodity",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex p-1"
                >
                    Commodity
                    <CaretSortIcon />
                </Button>
            )
        },
    },
    {
        accessorKey: "variety",
        header: "Variety",
    },
    {
        accessorKey: "grade",
        header: "Grade",
    },
    {
        accessorKey: "price",
        header: "Price/Kg",
    },
    {
        accessorKey: "moisture_in",
        header: "Moisture In",
    },
    {
        accessorKey: "number_of_bags",
        header: "No of Bags",
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
            const rawDate = row.getValue("createdAt") as string;

            // Handle invalid or null/undefined dates
            if (!rawDate) {
                return <div className="text-gray-500">No Date</div>;
            }

            try {
                // Create a valid date object
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
    {
        header: "Edit",
        id: "actions",
        cell: ({ row }) => {
            const intake = row.original

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
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(intake.id)}
                        >
                            Copy Intake ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/inventory/${intake.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]