import React from 'react'
import HandlingForm from './handlingForm'

export default async function Page({ params }: { params: Promise<{ intakeId: string }> }) {
    const intakeId = (await params).intakeId

    return (
        <section className='p-4 '>
            <HandlingForm/>
        </section>)
}