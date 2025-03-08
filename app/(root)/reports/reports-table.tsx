"use client"
"use memo"

import * as React from "react"
import { InventoryItemType, type DataTableFilterField } from "@/types"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { getColumns } from "./columns"
import { ReportsTableToolbarActions } from "./reports-toolbar-actions"
import { deposit } from "@/db/schema/deposit"

interface ReportsTableProps {
    data: InventoryItemType[];
    total: number;
    pageCount: number;
}

export function ReportsTable({ data, total, pageCount }: ReportsTableProps) {

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

    const uniqueVarieties = Array.from(
        new Set(data.map((item) => item.commodityVariety))
    ).map((variety) => ({
        label: variety,
        value: variety,
        withCount: true,
    }));

    const uniqueCommodities = Array.from(
        new Set(data.map((item) => item.commodityGroup))
    ).map((commodity) => ({
        label: commodity,
        value: commodity,
        withCount: true,
    }));

    const uniqueHolders = React.useMemo(() => {
        const holders = new Set(data.map(item => item.holder))
        return Array.from(holders).map(holder => ({
            label: holder,
            value: holder,
            withCount: true,
        }))
    }, [data])

    const uniqueDepositors = Array.from(
        new Set(data.map((item: any) => item.depositorId)) // Use `any` here
    ).map((depositor) => ({
        label: depositor,
        value: depositor,
        withCount: true,
    }));

    const filterFields: DataTableFilterField<InventoryItemType>[] = [
        {
            label: "Intake ID",
            value: "depositId",
            placeholder: "Filter intake IDs...",
        },
        {
            label: "Holder",
            value: "holder",
            options: uniqueHolders
        },
        {
            label: "Depositor",
            value: "depositorId",
            options: uniqueDepositors
        },
        {
            label: "Commodity",
            value: "commodityGroup",
            options: uniqueCommodities
        },
        {
            label: "Variety",
            value: "commodityVariety",
            options: uniqueVarieties
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
                <ReportsTableToolbarActions table={table} />
            </DataTableToolbar>
        </DataTable>
    )
}