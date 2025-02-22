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
import { MixerHorizontalIcon, TrashIcon } from "@radix-ui/react-icons"
import { DataTableFacetedFilter } from "./faceted-filter"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { DateRange } from "react-day-picker"
import { format, subDays } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

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
    onDelete?: () => void
    children?: React.ReactNode
}

export function DataTableToolbar<TData>({
    table,
    globalFilter,
    filterColumns,
    showColumnToggle = true,
    showDatePicker = false,
    onDelete,
    children,
}: DataTableToolbarProps<TData>) {

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 20),
        to: new Date(),
    })

    const handleDateSelect = (selectedDate: DateRange | undefined) => {
        setDate(selectedDate);
        if (selectedDate?.from && selectedDate?.to) {
            table.getColumn("createdAt")?.setFilterValue([selectedDate.from, selectedDate.to]);
        }
    };

    return (
        <div className="flex items-center gap-2 pb-4">
            <div className="flex flex-1 items-center space-x-2">
                {globalFilter && (
                    <Input
                        placeholder={`Filter ${globalFilter}...`}
                        value={(table.getColumn(globalFilter)?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn(globalFilter)?.setFilterValue(event.target.value);
                        }}
                        className="h-10 w-[150px] lg:w-[250px]"
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
            </div>

            <div className="flex items-center gap-2">
                {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <TrashIcon className="mr-2 size-4" aria-hidden="true" />
                                Delete ({table.getFilteredSelectedRowModel().rows.length})
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onDelete} className="bg-red-600 hover:bg-red-500">Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                ) : null}
            </div>


            {showColumnToggle && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-auto hidden lg:flex"
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

            {children && (
                <div>
                    {children}
                </div>
            )}
        </div>
    )
}