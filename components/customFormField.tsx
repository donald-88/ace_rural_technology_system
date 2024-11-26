"use client"

import React, { useState } from 'react'
import { Label } from './ui/label'
import { FormFieldType } from '@/lib/types'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Calendar } from './ui/calendar'
import { LucideCalendar, Search } from 'lucide-react'

interface CustomProps {
    fieldtype: FormFieldType;
    name: string;
    id: string;
    label?: string;
    placeholder?: string;
    options?: string[];
    required?: boolean;
    value?: string | Date;
    onChange?: (value: string | Date) => void;
}

const RenderField = ({ props }: { props: CustomProps }) => {
    const [date, setDate] = useState<Date | undefined>(props.value as Date | undefined)

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate)
        if (props.onChange && newDate) {
            props.onChange(newDate)
        }
    }

    switch (props.fieldtype) {
        case FormFieldType.INPUT:
            return <Input
                type="text"
                {...props}
                value={props.value as string}
                onChange={(e) => props.onChange && props.onChange(e.target.value)}
            />

        case FormFieldType.PASSWORD:
            return <Input
                type="password"
                required={props.required}
                {...props}
                value={props.value as string}
                onChange={(e) => props.onChange && props.onChange(e.target.value)}
            />
        case FormFieldType.NUMBER:
            return <Input
                type="number"
                required={props.required}
                {...props}
                value={props.value as string}
                onChange={(e) => props.onChange && props.onChange(e.target.value)}
            />

        case FormFieldType.EMAIL:
            return <Input
                type="email"
                {...props}
                value={props.value as string}
                onChange={(e) => props.onChange && props.onChange(e.target.value)}
            />

        case FormFieldType.SELECT:
            return (
                <Select onValueChange={(value) => props.onChange && props.onChange(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue className='text-secondary placeholder:text-secondary' placeholder={props.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                props.options!.map((option, index) => (
                                    <SelectItem className="text-secondary" key={index} value={option}>{option}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )

        case FormFieldType.DATE_INPUT:
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left text-secondary font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <LucideCalendar className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            )

        case FormFieldType.SEARCH:
            return (
                <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={props.placeholder}
                        value={props.value as string}
                        onChange={(e) => props.onChange && props.onChange(e.target.value)}
                        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                </div>
            )

        default:
            return <div>Unsupported field type</div>
    }
}

const CustomFormField = (props: CustomProps) => {
    return (
        <div className='flex flex-col gap-2'>
            {props.label && <Label className='text-secondary' htmlFor={props.id}>{props.label}</Label>}
            <RenderField props={props} />
        </div>
    )
}

export default CustomFormField