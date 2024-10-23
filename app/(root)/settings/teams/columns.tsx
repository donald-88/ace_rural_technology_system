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
import { ChevronsUpDown, MoreHorizontal, PencilLine, Trash2 } from "lucide-react"
import Link from "next/link"


export type Team = {
    _id: string
    name: string
    phone: number
    status: string
    time: string
    date: string
}

export const columns: ColumnDef<Team>[] = [
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
        accessorKey: "$id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex p-1"
                >
                    Team Member
                    <ChevronsUpDown size={16} />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("name")}
                    </span>
                </div>
            )
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
                    <ChevronsUpDown size={16} />
                </Button>
            )
        },
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
                    <ChevronsUpDown size={16} />
                </Button>
            )
        },
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
                    <ChevronsUpDown size={16} />
                </Button>
            )
        },
    },
    {
        header: "Edit",
        id: "actions",
        cell: ({ row }) => {
            const intake = row.original

            return (
                <div className="flex justify-start items-center gap-1">
                    <Button variant="ghost" className="h-8 w-8 p-0 text-red-500">
                        <Trash2 size={16} />
                    </Button>

                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <PencilLine size={16} />
                    </Button>
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
                                onClick={() => navigator.clipboard.writeText(intake._id)}
                            >
                                Copy Intake ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Link href={`/inventory/${intake._id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
