import CustomFormField from '@/components/customFormField'
import { Button } from '@/components/ui/button'
import { FormFieldType } from '@/lib/types'
import React from 'react'

const WarehouseHandling = () => {
    return (
        <section className='px-4 pt-10 h-full w-full flex flex-col items-center'>
            <div className='flex gap-2 lg:w-[720px] h-min mb-2'>
                <CustomFormField fieldtype={FormFieldType.SEARCH} placeholder='Search intake id' name={'search'} id={'search'} />
                <Button>Search</Button>
            </div>
            <p className='text-muted-foreground'>Scan the barcode on the bag to get the reference id</p>
            <div className='w-full h-full flex justify-center items-center'>
                <p className='text-muted-foreground'>No handling results were found</p>
            </div>
        </section>
    )
}

export default WarehouseHandling