"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Control } from "react-hook-form"

interface ComboBoxProps {
    control: Control<any>
    name: string
    label: string
    subLabel?: string
    placeholder: string
    options: { label: string; subLabel?: string, value: string }[]

}

export function CustomComboBox({ options, control, name, label, placeholder }: ComboBoxProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-secondary">{label}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {field.value
                                        ? options.find((framework) => framework.value === field.value)?.label
                                        : placeholder}
                                    <ChevronsUpDown size={16} className="opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder={placeholder} className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No results found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((framework) => (
                                            <CommandItem
                                                key={framework.value}
                                                value={framework.value}
                                                onSelect={(currentValue) => {
                                                    field.onChange(currentValue)
                                                    setOpen(false)
                                                }}                                            >
                                                <div className="flex flex-col">
                                                    {framework.label}
                                                    <span>{framework.subLabel}</span>
                                                </div>


                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value === framework.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}