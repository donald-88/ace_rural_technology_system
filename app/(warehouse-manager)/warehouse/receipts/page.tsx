import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { getReceipts } from '@/lib/actions/receipt.actions'

export default async function Page() {
  const receipts = await getReceipts()

  const warehouses = await fetch('http://localhost:3000/api/acemain/warehouse').then((res) => res.json())
  const clients = await fetch('http://localhost:3000/api/acemain/clients').then((res) => res.json())
  const commodities = await fetch('http://localhost:3000/api/acemain/commodity').then((res) => res.json())
  const grade = await fetch('http://localhost:3000/api/acemain/grade').then((res) => res.json())
  const cropSeason = await fetch('http://localhost:3000/api/acemain/season').then((res) => res.json())
  return (
    <section className='p-4'>
        <DataTable columns={columns} data={receipts} props={{ warehouses, clients, commodities, grade, cropSeason }} />
    </section>
  )
}
