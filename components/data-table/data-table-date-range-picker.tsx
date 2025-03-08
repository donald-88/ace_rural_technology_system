"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps
    extends React.ComponentPropsWithoutRef<typeof PopoverContent> {

    /**
     * The class name of the calendar trigger button.
     * @default undefined
     * @type string
     */
    triggerClassName?: string
}

export function DateRangePicker({
    triggerClassName,
    className,
    ...props
}: DateRangePickerProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        const fromParam = searchParams.get("from")
        const toParam = searchParams.get("to")

        let fromDay: Date | undefined
        let toDay: Date | undefined

        return {
            from: fromParam ? new Date(fromParam) : fromDay,
            to: toParam ? new Date(toParam) : toDay,
        }
    })

    // Update query string
    React.useEffect(() => {
        const newSearchParams = new URLSearchParams(searchParams)
        if (date?.from) {
            newSearchParams.set("from", format(date.from, "yyyy-MM-dd"))
        } else {
            newSearchParams.delete("from")
        }

        if (date?.to) {
            newSearchParams.set("to", format(date.to, "yyyy-MM-dd"))
        } else {
            newSearchParams.delete("to")
        }

        router.replace(`${pathname}?${newSearchParams.toString()}`, {
            scroll: false,
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date?.from, date?.to])

    return (
        <div className="grid gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        size={"sm"}
                        className={cn(
                            "w-full justify-start truncate text-left font-normal",
                            !date && "text-muted-foreground",
                            triggerClassName
                        )}
                    >
                        <CalendarIcon className="mr-2 size-4" />
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
                            <span>{"Pick a date"}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className={cn("w-auto p-0", className)} {...props}>
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}