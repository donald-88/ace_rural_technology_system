"use client"

import React from "react"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { DataTable } from "@/components/data-table/data-table"
import { Dispatch } from "@/db/schema/dispatch"
import { useDataTable } from "@/hooks/use-data-table"
import { getColumns } from "./columns"
import { DataTableFilterField } from "@/types"

interface DispatchTableProps {
    data: Dispatch[];
    total: number;
    pageCount: number;
}

export function DispatchTable({
    data,
    total,
    pageCount,
}: DispatchTableProps) {

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
     */

    // const uniqueCommodities = Array.from(
    //     new Set(data.map((item: any) => item.commodityGroup)) // Use `any` here
    // ).map((commodity) => ({
    //     label: commodity,
    //     value: commodity,
    // }));

    const filterFields: DataTableFilterField<Dispatch>[] = [
        {
            label: "Dispatch ID",
            value: "id",
            placeholder: "Filter dispatch IDs...",
        },
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
                {/* <IntakeTableToolbarActions table={table} /> */}
            </DataTableToolbar>
        </DataTable>
    )
}