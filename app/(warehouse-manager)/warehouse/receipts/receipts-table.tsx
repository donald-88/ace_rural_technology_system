"use client"
"use memo"

import * as React from "react"
import { ClientType, CommodityTypes, WarehouseType, type DataTableFilterField } from "@/types"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { getColumns } from "./columns"
import { WarehouseReceipt } from "@/db/schema/warehouse-receipt"
import { ReceiptTableToolbarActions } from "./receipt-toolbar-actions"

interface ReceiptsTableProps {
    data: WarehouseReceipt[];
    total: number;
    pageCount: number;
    warehouses: WarehouseType[]
    clients: ClientType[]
    commodities: CommodityTypes[],
    grade: string[]
    cropSeason: string[]

}

export function ReceiptsTable({ data, total, pageCount, warehouses, clients, commodities, grade, cropSeason }: ReceiptsTableProps) {
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

    const filterFields: DataTableFilterField<WarehouseReceipt>[] = [
        {
            label: "WHR",
            value: "id",
            placeholder: "Filter warehouse receipts...",
        },
        {
            label: "Holder",
            value: "holder",
            options: clients.map(client => ({
                label: client.name,
                value: client.name,
                withCount: true,
            }))

        },
        {
            label: "Commodity",
            value: "commodityGroup",
            options: commodities.map(commodity => ({
                label: commodity.group,
                value: commodity.group,
                withCount: true,
            }))
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
                <ReceiptTableToolbarActions table={table} warehouses={warehouses} clients={clients} commodities={commodities} grade={grade} cropSeason={cropSeason} />
            </DataTableToolbar>
        </DataTable>
    )
}