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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "./ui/calendar"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"

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
    showDatePicker?: boolean
}

export function DataTableToolbar<TData>({
    table,
    globalFilter,
    filterColumns,
    showColumnToggle = true,
    showDatePicker = false
}: DataTableToolbarProps<TData>) {

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2022, 0, 20),
        to: addDays(new Date(2022, 0, 20), 20),
    })

    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate);
        if (selectedDate?.from && selectedDate?.to) {
            table.getColumn("createdAt")?.setFilterValue([selectedDate.from, selectedDate.to]);
        }
    };

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


            {
                showDatePicker && (
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-[300px] flex gap-2 justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <p>Pick a date</p>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={handleDateSelect}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>
                )
            }

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