import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { FormFieldType } from '@/lib/types'
import React from 'react'

const WarehouseDispatch = () => {
    return (
        <section className='px-4 pt-8 h-full w-full flex flex-col items-center'>
            <div className='flex gap-2 lg:w-[720px] h-min mb-2'>
                <CustomFormField fieldtype={FormFieldType.SEARCH} placeholder='Search intake id' name={'search'} id={'search'} />
                <Button>Search</Button>
            </div>
            <div className='w-full h-full flex justify-center items-center'>
                <p className='text-muted-foreground'>No dispatch results were found</p>
            </div>
        </section>
    )
}

export default WarehouseDispatch