"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

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
                    <ArrowUpDown size={16} />
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
        header: "Role",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "timeOfEntry",
        header: "Time of Entry",
    },
    {
        accessorKey: "timeOFExit",
        header: "Time of Exit",
    }
]
