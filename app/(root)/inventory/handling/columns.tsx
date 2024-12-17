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
import { deleteHandlingItemAction } from "./actions"
import { toast } from "sonner"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Intake = {
    $id: string
    customerID: string
    commodity: string
    variety: string
    grade: number
    price: number
    grossWeight: number
    deductions: number
    netWeight: number
    moistureIn: number
    incomingBagCount: number
    numberOfBags: number
    time: string
    date: string
}

const deleteInventory = async (id: string) => {
    const deletedIntake = await deleteHandlingItemAction(id)

    if (deletedIntake.success) {
        toast.success("Intake deleted successfully")
    } else {
        toast.error("Error deleting intake")
    }
}

export const columns: ColumnDef<Intake>[] = [
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
        header: "Handling ID",
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
                    Customer ID
                    <ChevronsUpDown size={16} />
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
                    <ChevronsUpDown size={16} />
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
        accessorKey: "moistureIn",
        header: "Moisture In",
    },
    {
        accessorKey: "numberOfBags",
        header: "No of Bags",
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
                            onClick={() => navigator.clipboard.writeText(intake.$id)}
                        >
                            Copy Intake ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/inventory/${intake.$id}`}>View Details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteInventory(intake.$id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]