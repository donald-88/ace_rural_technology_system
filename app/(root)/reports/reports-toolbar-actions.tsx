"use client"

import { DownloadIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { InventoryItemType } from "@/types"
import exportToCsv from "tanstack-table-export-to-csv";
import { DataTableDeleteDialog } from "@/components/data-table/data-table-delete-dialog"
import { deleteReportAction } from "@/lib/actions/reports.action"
import { toast } from "sonner"

interface ReportsTableToolbarActionsProps {
    table: Table<InventoryItemType>
}

export function ReportsTableToolbarActions({
    table,
}: ReportsTableToolbarActionsProps) {

    const handleDelete = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const intakeIds: string[] = [];
        selectedRows.map((row) => {
            const rowData = row.original as { depositId: string };
            intakeIds.push(rowData.depositId);
        });

        const deletedIntake = await deleteReportAction(intakeIds);

        if (deletedIntake.success) {
            toast.success("Intake deleted successfully");
            table.toggleAllRowsSelected(false);
        } else {
            toast.error("Failed to delete intake");
        }
    };
    return (
        <div className="flex items-center gap-2">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                // and on Drawer Component its mandatory to pass open & openChange prop
                <DataTableDeleteDialog
                    onSuccess={handleDelete}
                />
            ) : null}
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