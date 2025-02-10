"use client"

import React, { useState } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTableToolbar } from "@/components/data-table-toolbar"
import { deleteDispatchItemAction } from "./actions"
import { toast } from "sonner"
import { DataTablePagination } from "@/components/data-table-pagination"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection
        },

    })

    const uniqueCommodities = Array.from(
        new Set(data.map((item: any) => item.commodity)) // Use `any` here
    ).map((commodity) => ({
        label: commodity,
        value: commodity,
    }));

    const uniqueVarieties = Array.from(
        new Set(data.map((item: any) => item.variety)) // Use `any` here
    ).map((variety) => ({
        label: variety,
        value: variety,
    }));

    const deleteInventory = async () => {
        const selectedRows = table.getSelectedRowModel().rows;
        const intakeIds: string[] = [];
        selectedRows.map((row) => {
            const rowData = row.original as { intakeId: string };
            intakeIds.push(rowData.intakeId);
        });
        const deletedIntake = await deleteDispatchItemAction(intakeIds);

        if (deletedIntake.success) {
            toast.success("Intake deleted successfully");
        } else {
            toast.error("Error deleting intake");
        }
    };


    return (
        <div>
            <DataTableToolbar
                table={table}
                globalFilter="intakeId"
                showColumnToggle={true}
                showDatePicker={true}
                onDelete={deleteInventory}
                filterColumns={[
                    {
                        title: "commodity",
                        options: uniqueCommodities
                    },
                    {
                        title: "variety",
                        options: uniqueVarieties
                    }
                ]}
            />
            <div className="rounded-md border mb-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}