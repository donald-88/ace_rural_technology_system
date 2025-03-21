import React from 'react'
import { ClientTable } from "./client-table"
import { columns } from './columns'

export default async function Page() {
    const clients = await fetch(`${process.env.BASE_URL}/api/acemain/clients`, {
        method: "GET",
        next: {
            revalidate: 60,
        }
    }).then((res) => res.json());

    return (
        <section className='container mx-auto p-2 sm:p-4'>
            <ClientTable columns={columns} data={clients} />
        </section>
    )
}