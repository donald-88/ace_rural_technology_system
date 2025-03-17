import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { Input } from "@/components/ui/input"
import type { Table } from "@tanstack/react-table"

interface ClientToolbarProps<TData> {
    table: Table<TData>
}

export function ClientToolbar<TData>({ table }: ClientToolbarProps<TData>) {
    return (
        <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter clients..."
                    value={table.getColumn("id")?.getFilterValue() as string}
                    onChange={(event) =>
                        table.getColumn("id")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-40 lg:w-64"
                />
            </div>

            <DataTableViewOptions table={table} />
        </div>
    )
}