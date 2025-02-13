import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'

export default function Page() {
  return (
    <section className='p-4'>
        <DataTable columns={columns} data={[]}/>
    </section>
  )
}
