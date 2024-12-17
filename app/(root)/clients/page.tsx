import React from 'react'
import { DataTable } from "./data-table"
import { columns } from './columns'
import { getTeam } from '@/lib/actions/team.actions'

const Customers = async() => {

    const data = await getTeam()
    return (
        <section className='p-4'>
            <DataTable columns={columns} data={data as any} />
        </section>
    )
}

export default Customers