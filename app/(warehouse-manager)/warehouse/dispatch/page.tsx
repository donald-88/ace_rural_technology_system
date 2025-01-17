import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { FormFieldType } from '@/lib/types'
import React from 'react'

const WarehouseDispatch = () => {
    return (
        <section className='p-4 grid gap-2'>
            <div className='flex gap-2 w-full bg-red-100'>
                <CustomFormField fieldtype={FormFieldType.SEARCH} placeholder='intake id' name={'search'} id={'search'} />
                <Button>Search</Button>
            </div>
        </section>
    )
}

export default WarehouseDispatch