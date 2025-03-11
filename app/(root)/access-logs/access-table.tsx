"use client"

import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { Access } from "@/db/schema/access"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableFilterField } from "@/types"
import React from "react"
import { getColumns } from "./columns"

interface AccessTableProps {
    data: Access[],
    total: number
    pageCount: number,
    devices: any[]
}

export function AccessTable({
    data,
    total,
    pageCount,
    devices
}: AccessTableProps) {


    // Memoize the columns so they don't re-render on every render
    const columns = React.useMemo(() => getColumns(), [])

    /**
     * This component can render either a faceted filter or a search filter based on the `options` prop.
     *
     * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
     *
     * Each `option` object has the following properties:
     * @prop {string} label - The label for the filter option.
     * @prop {string} value - The value for the filter option.
     * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
     * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
     **/

    const filterFields: DataTableFilterField<Access>[] = [
        {
            label: "Access ID",
            value: "id",
            placeholder: "Filter access IDs...",
        },
        {
            label: "Device",
            value: "lockId",
            options: devices?.map(device => ({
                label: device.deviceName,
                value: device.deviceId,
            }))
        }
    ]

    const { table } = useDataTable({
        data,
        columns,
        pageCount,
        /* optional props */
        filterFields,
        state: {
            sorting: [{ id: "createdAt", desc: true }],
            pagination: { pageIndex: 0, pageSize: 10 },
        },

        /* */
    })

    return (
        <DataTable
            totalRows={total}
            table={table}
        >
            <DataTableToolbar table={table} filterFields={filterFields}>
                {/* <ReportsTableToolbarActions table={table} /> */}
            </DataTableToolbar>
        </DataTable>
    )
}
