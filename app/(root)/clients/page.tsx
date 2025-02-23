import React from 'react'
import { DataTable } from "./data-table"
import { columns } from './columns'

export default async function Page () {
    const clients = await fetch("http://localhost:3000/api/acemain/clients", {
        method: "GET",
        next: {
            revalidate: 60,
        }
    }).then((res) => res.json());

    return (
        <section className='p-4'>
            <DataTable columns={columns} data={clients} />
        </section>
    )
}