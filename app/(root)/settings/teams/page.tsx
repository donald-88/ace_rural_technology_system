import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import { getTeam } from '@/lib/actions/team-actions'

export default async function Page() {
  const teamMembers = await JSON.parse(JSON.stringify(await getTeam()))
  return (
    <section className='container mx-auto p-4'>
      <DataTable columns={columns} data={teamMembers} />
    </section>
  )
}