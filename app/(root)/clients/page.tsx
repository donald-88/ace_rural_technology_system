import React from 'react'
import { DataTable } from "./data-table"
import { columns } from './columns'
import { getClients } from '@/lib/actions/clients.actions'

const Clients = async () => {
    const data = await getClients()
    
    return (
        <section className='p-4'>
            <DataTable columns={columns} data={data} />
        </section>
    )
}

export default Clients