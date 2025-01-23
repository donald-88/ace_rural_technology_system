import React from "react"
import { Table } from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { DataTableFacetedFilter } from "./faceted-filter"
import { Input } from "./ui/input"

interface FilterColumnConfig {
    title: string
    options: {
        label: string
        value: string
    }[]
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    globalFilter?: string
    filterColumns?: FilterColumnConfig[]
    showColumnToggle?: boolean
}

export function DataTableToolbar<TData>({
    table,
    globalFilter,
    filterColumns,
    showColumnToggle = true
}: DataTableToolbarProps<TData>) {
    return (
        <div className="flex items-center gap-2 pb-4">
            {globalFilter && (
                <Input
                    placeholder={`Filter ${globalFilter}...`}
                    value={(table.getColumn(globalFilter)?.getFilterValue() as string) ?? ""}
                    onChange={(event) => {
                        table.getColumn(globalFilter)?.setFilterValue(event.target.value);
                    }}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
            )}

            {filterColumns?.map((filterColumn) => (
                <DataTableFacetedFilter
                    key={filterColumn.title}
                    column={table.getColumn(filterColumn.title)}
                    title={filterColumn.title}
                    options={filterColumn.options}
                />
            ))}

            {showColumnToggle && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto hidden h-8 lg:flex"
                        >
                            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                            View
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[150px]">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter(
                                (column) =>
                                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                            )
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}