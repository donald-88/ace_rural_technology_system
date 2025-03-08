"use client"

import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { InventoryItemType } from "@/types"
import exportToCsv from "tanstack-table-export-to-csv";

interface ReportsTableToolbarActionsProps {
    table: Table<InventoryItemType>
}

export function ReportsTableToolbarActions({
    table,
}: ReportsTableToolbarActionsProps) {
    return (
        <div className="flex items-center gap-2">
            {/* {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                // @ts-expect-error - bcoz we are also Drawer Component for Mobile view
                // and on Drawer Component its mandatory to pass open & openChange prop
                <DeleteTasksDialog
                    tasks={table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original)}
                    onSuccess={() => table.toggleAllRowsSelected(false)}
                />
            ) : null} */}
            <Button
                size="sm"
                onClick={() => {
                    const headers = table
                        .getHeaderGroups()
                        .map((x) => x.headers)
                        .flat();

                    const rows = table.getCoreRowModel().rows;

                    exportToCsv("CHILIMIKA WAREHOUSE INVENTORY REPORT", headers, rows);
                }
                }
            >
                <DownloadIcon className="size-4" aria-hidden="true" />
                Export
            </Button>
            {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
        </div>
    )
}