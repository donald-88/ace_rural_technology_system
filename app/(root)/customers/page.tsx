import React from 'react'
import { DataTable } from "./data-table"
import { columns } from './columns'

const Customers = () => {

    const data = []
    return (
        <section className='p-4'>
            <DataTable columns={columns} data={data} />
        </section>
    )
}

export default Customers