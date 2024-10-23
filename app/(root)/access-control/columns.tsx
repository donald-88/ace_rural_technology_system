"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Access = {
    id: string
    name: string
    email: string
    reason: string
    role: string
    date: string
    timeOfEntry: string
    timeOFExit: string
}

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
        ),},
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ChevronsUpDown size={16} />
                </Button>
            )
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
            )
        },
    },
    {
        accessorKey: "$createdAt",
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
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("$createdAt") as string
            const formatted = new Date(date).toLocaleDateString()
            return <div className="font-medium text-left">{formatted}</div>
        }
    },
    {
        accessorKey: "$createdAt",
        header: "Time of Entry",
        cell: ({ row }) => {
            const date = row.getValue("$createdAt") as string
            const formatted = new Date(date).toLocaleTimeString()
            return <div className="font-medium text-left">{formatted}</div>
        }
    },
    {
        accessorKey: "$updatedAt",
        header: "Time of Exit",
        cell: ({ row }) => {
            const date = row.getValue("$updatedAt") as string
            const formatted = new Date(date).toLocaleTimeString()
            return <div className="font-medium text-left">{formatted}</div>
        }
    }
]
