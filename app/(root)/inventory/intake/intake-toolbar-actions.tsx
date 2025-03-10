"use client"

import { type Table } from "@tanstack/react-table"
import { InventoryItemType } from "@/types"
import { DataTableDeleteDialog } from "@/components/data-table/data-table-delete-dialog"
import { toast } from "sonner"
import { deleteIntakeItems } from "@/lib/actions/intake.actions"

interface IntakeTableToolbarActionsProps {
    table: Table<InventoryItemType>
}

export function IntakeTableToolbarActions({
    table,
}: IntakeTableToolbarActionsProps) {

    const handleDelete = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const intakeIds: string[] = [];
        selectedRows.map((row) => {
            const rowData = row.original as { depositId: string };
            intakeIds.push(rowData.depositId);
        });

        const deletedIntake = await deleteIntakeItems(intakeIds);

        if (deletedIntake.success) {
            toast.success("Intake deleted successfully");
            table.toggleAllRowsSelected(false);
        } else {
            toast.error("Failed to delete intake");
        }
    };
    return (
        <div className="flex items-center gap-2" >
            {
                table.getFilteredSelectedRowModel().rows.length > 0 ? (
                    <DataTableDeleteDialog
                        onSuccess={handleDelete}
                    />
                ) : null}
            {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
        </div>
    )
}