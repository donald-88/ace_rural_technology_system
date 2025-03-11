import React from 'react'
import { getReceipts } from '@/lib/actions/receipt.actions'
import { ReceiptsTable } from './receipts-table'
import { CommodityTypes, SearchParams } from '@/types'
import { receiptSearchParamsSchema } from '@/lib/validation';

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const paramsToUse = searchParams instanceof Promise
    ? await searchParams
    : searchParams;
  const search = receiptSearchParamsSchema.parse(paramsToUse);
  const { data, total, pageCount } = await getReceipts(search)

  const warehouses = await fetch('http://localhost:3000/api/acemain/warehouse').then((res) => res.json())
  const clients = await fetch('http://localhost:3000/api/acemain/clients').then((res) => res.json())
  const commodities = await fetch('http://localhost:3000/api/acemain/commodity').then((res) => res.json()) as CommodityTypes[]
  const grade = await fetch('http://localhost:3000/api/acemain/grade').then((res) => res.json())
  const cropSeason = await fetch('http://localhost:3000/api/acemain/season').then((res) => res.json())
  return (
    <section className='p-4'>
      <ReceiptsTable data={data} total={total} pageCount={pageCount}
        warehouses={warehouses}
        clients={clients}
        commodities={commodities}
        grade={grade}
        cropSeason={cropSeason}
         />
    </section>
  )
}
