"use client"

import React, { useState, useEffect } from "react"
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

import { Button } from "@/components/ui/button"
import CustomFormField from "@/components/customFormField"
import { FormFieldType } from "@/lib/types"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})

    const [summaryDetails, setSummaryDetails] = useState({
        totalNetWeight: 0,
        numberOfCommodities: 0,
        numberOfHolders: 0,
        numberOfCommodityVarieties: 0,
    })

    // Calculate or fetch the summary details
    useEffect(() => {
        const calculateSummaryDetails = () => {
            let totalNetWeight = 0
            const numberOfCommodities = new Set()
            const numberOfHolders = new Set()
            const numberOfCommodityVarieties = new Set()

            // Assuming data is an array of objects with necessary fields
            data.forEach((item: any) => {
                totalNetWeight += item.netWeight || 0
                numberOfCommodities.add(item.commodity)
                numberOfHolders.add(item.holder)
                numberOfCommodityVarieties.add(item.variety)
            })

            setSummaryDetails({
                totalNetWeight,
                numberOfCommodities: numberOfCommodities.size,
                numberOfHolders: numberOfHolders.size,
                numberOfCommodityVarieties: numberOfCommodityVarieties.size,
            })
        }

        calculateSummaryDetails()
    }, [data])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

    return (
        <div>
            {/* Summary Details Section */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Summary Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        {/* Direct implementation of read-only fields */}
                        <label htmlFor="totalNetWeight" className="block text-sm font-medium text-gray-700">
                            Total Net Weight
                        </label>
                        <input
                            type="text"
                            id="totalNetWeight"
                            value={summaryDetails.totalNetWeight}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="numberOfCommodities" className="block text-sm font-medium text-gray-700">
                            Number of Commodities
                        </label>
                        <input
                            type="text"
                            id="numberOfCommodities"
                            value={summaryDetails.numberOfCommodities}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="numberOfHolders" className="block text-sm font-medium text-gray-700">
                            Number of Holders
                        </label>
                        <input
                            type="text"
                            id="numberOfHolders"
                            value={summaryDetails.numberOfHolders}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="numberOfCommodityVarieties" className="block text-sm font-medium text-gray-700">
                            Number of Commodity Varieties
                        </label>
                        <input
                            type="text"
                            id="numberOfCommodityVarieties"
                            value={summaryDetails.numberOfCommodityVarieties}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="flex items-center pb-4">
                <CustomFormField
                    fieldtype={FormFieldType.SEARCH}
                    name="search"
                    id="search"
                    placeholder="Search"
                    onChange={(value) => {
                        const emailColumn = table.getColumn("phone")
                        if (emailColumn) {
                            emailColumn.setFilterValue(value as string)
                        }
                    }}
                    value={table.getColumn("phone")?.getFilterValue() as string ?? ""}
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
