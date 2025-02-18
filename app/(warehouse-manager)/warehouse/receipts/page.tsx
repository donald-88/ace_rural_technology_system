import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { getReceipts } from '@/lib/actions/receipt.actions'

export default async function Page() {

  const receipts = await getReceipts()
  return (
    <section className='p-4'>
        <DataTable columns={columns} data={receipts}/>
    </section>
  )
}
