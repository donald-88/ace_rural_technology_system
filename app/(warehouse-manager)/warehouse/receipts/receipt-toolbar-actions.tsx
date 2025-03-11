"use client"

import { type Table } from "@tanstack/react-table"
import { DataTableDeleteDialog } from "@/components/data-table/data-table-delete-dialog"
import { toast } from "sonner"
import { deleteReceiptsAction } from "./actions"
import { WarehouseReceipt } from "@/db/schema/warehouse-receipt"
import { ClientType, CommodityTypes, WarehouseType } from "@/types"
import CreateReceipt from "./createReceipt"

interface ReceiptTableToolbarActionsProps {
    table: Table<WarehouseReceipt>
    warehouses: WarehouseType[]
    clients: ClientType[]
    commodities: CommodityTypes[],
    grade: string[]
    cropSeason: string[]
}

export function ReceiptTableToolbarActions({
    table,
    warehouses,
    clients,
    commodities,
    grade,
    cropSeason
}: ReceiptTableToolbarActionsProps) {

    const handleDelete = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const intakeIds: string[] = [];
        selectedRows.map((row) => {
            const rowData = row.original as { id: string };
            intakeIds.push(rowData.id);
        });

        const deletedIntake = await deleteReceiptsAction(intakeIds);

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

            <CreateReceipt props={{ warehouses, clients, commodities, grade, cropSeason }}
            />
            {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
        </div>
    )
}