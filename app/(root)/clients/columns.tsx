"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown } from "lucide-react"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Customer = {
    id: string
    name: string
    email: string
    address: string
    phone: string
    vehicle: string
    accountName: string
    accountNumber: string
    bank: string
}

export const columns: ColumnDef<Customer>[] = [
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
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "phone",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Phone
                    <ChevronsUpDown size={16} />
                </Button>
            )
        },
    },
    {
        accessorKey: "vehicle",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="flex p-1"
                >
                    Vehicle
                    <ChevronsUpDown size={16} />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = row.getValue("vehicle") as string
            const formatted = new Date(date).toLocaleDateString()
            return <div className="font-medium text-left">{formatted}</div>
        }
    },
    {
        accessorKey: "accountName",
        header: "Account Name",
        cell: ({ row }) => {
            const date = row.getValue("accountName") as string
            const formatted = new Date(date).toLocaleTimeString()
            return <div className="font-medium text-left">{formatted}</div>
        }
    },
    {
        accessorKey: "accountNumber",
        header: "Account Number",
        cell: ({ row }) => {
            const date = row.getValue("accountNumber") as string
            const formatted = new Date(date).toLocaleTimeString()
            return <div className="font-medium text-left">{formatted}</div>
        }
    },
    {
        accessorKey: "bank",
        header: "Bank",
        cell: ({ row }) => {
            const date = row.getValue("bank") as string
            const formatted = new Date(date).toLocaleTimeString()
            return <div className="font-medium text-left">{formatted}</div>
        }
    }
]
