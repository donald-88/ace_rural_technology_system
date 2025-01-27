'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import CustomFormField from "./customFormField"
import { FormFieldType } from "@/lib/types"

export default function WarehouseSearch({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('query', term)
        } else {
            params.delete('query')
        }
        replace(`${pathname}?${params.toString()}`)
    }
    return (
        <CustomFormField
            fieldtype={FormFieldType.SEARCH}
            defaultValue={searchParams.get('query')?.toString()}
            onChange={(value: string | Date) => {
                if (typeof value === 'string') {
                    handleSearch(value);
                }
            }}
            placeholder={placeholder}
            name={'search'}
            id={'search'}
        />
    )
}