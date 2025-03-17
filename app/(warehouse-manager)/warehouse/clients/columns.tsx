"use client"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { ClientType } from "@/types"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ClientType>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        }
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Email" />
        },
    },
    {
        accessorKey: "address",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Address" />
        }
    },
    {
        accessorKey: "phone",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Phone" />
        },
    },
]
