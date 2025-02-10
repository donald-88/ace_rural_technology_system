"use client"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ClientType } from "@/types"
import { CaretSortIcon } from "@radix-ui/react-icons"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ClientType>[] = [
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
        header: ({ column }) => (
              <DataTableColumnHeader column={column} title="Name" />
            ),
    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Address" />
        ),
    },
    {
        accessorKey: "phone",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phone" />
        ),
    },
    {
        accessorKey: "vehicle",
        header: 'Vehicle'
    },
    {
        accessorKey: "accountName",
        header: "Account Name",
    },
    {
        accessorKey: "accountNumber",
        header: "Account Number",
    },
    {
        accessorKey: "bank",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Bank" />
        ),
    }
]
