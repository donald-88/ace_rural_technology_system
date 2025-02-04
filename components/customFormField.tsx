"use client"

import React from 'react'
import { FormFieldType } from '@/lib/types'
import { Input } from './ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Search } from 'lucide-react'
import { Control } from 'react-hook-form'

interface CustomProps {
    control: Control<any>
    name: string;
    id: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldtype: FormFieldType;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
    switch (props.fieldtype) {
        case FormFieldType.INPUT:
            return (
                <FormControl>
                    <Input
                        placeholder={props.placeholder}
                        type="text"
                        {...field}
                    />
                </FormControl>
            )

        case FormFieldType.PASSWORD:
            return <FormControl>
                <Input
                    placeholder={props.placeholder}
                    type="password"
                    required={props.required}
                    {...field}
                />
            </FormControl>
        case FormFieldType.NUMBER:
            return <FormControl>
                <Input
                    placeholder={props.placeholder}
                    type="number"
                    required={props.required}
                    {...field}
                />
            </FormControl>

        case FormFieldType.PHONE_INPUT:
            return <FormControl>
                <Input
                    placeholder={props.placeholder}
                    type="tel" required={props.required}
                    {...field} />
            </FormControl>

        case FormFieldType.TEXTAREA:
            return <FormControl>
                <Textarea
                    placeholder={props.placeholder}
                    required={props.required}
                    {...field} />
            </FormControl>

        case FormFieldType.EMAIL:
            return <FormControl>
                <Input
                    placeholder={props.placeholder}
                    type="email"
                    {...field}
                />
            </FormControl>

        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue className='.placeholder-text-muted::placeholder' placeholder={props.placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )

        case FormFieldType.SEARCH:
            return (
                <div className="relative ml-auto flex-1 grow-1">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                        <Input
                            type="search"
                            placeholder={props.placeholder}
                            className="w-full rounded-lg bg-background pl-8"
                        />
                    </FormControl>
                </div>
            )

        case FormFieldType.SKELETON:
            return props.renderSkeleton ? props.renderSkeleton(field) : null;

        default:
            return null
    }
}

const CustomFormField = (props: CustomProps) => {
    const { control, name, label } = props
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {props.fieldtype !== FormFieldType.CHECKBOX && label && <FormLabel className="text-secondary">{label}</FormLabel>}
                    <RenderField field={field} props={props} />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField