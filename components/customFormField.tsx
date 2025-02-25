"use client"

import React from 'react'
import { FormFieldType } from '@/lib/types'
import { Input } from './ui/input'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Control } from 'react-hook-form'
import { FileUpload } from './file-uploader'

interface CustomProps {
    control: Control<any>
    name: string;
    id?: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
    fieldtype: FormFieldType;
    defaultValue: number;
    options?: any[];
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
                        disabled={props.disabled}
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
                    {...field}
                    disabled={props.disabled}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                />
            </FormControl>

        case FormFieldType.PHONE_INPUT:
            return <FormControl>
                <Input
                    placeholder={props.placeholder}
                    type="tel" required={props.required}
                    {...field}
                    disabled={props.disabled}
                />
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
                    disabled={props.disabled}
                />
            </FormControl>

        case FormFieldType.FILE:
            return <FormControl>
                <FileUpload
                    accept="image/*"
                    maxSize={5 * 1024 * 1024}
                    onChange={(file) => field.onChange(file)}
                    value={field.value}
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