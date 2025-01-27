import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import WarehouseSearch from '@/components/warehouseSearchBar'
import { getIntakeById } from '@/lib/actions/intake.actions'
import Link from 'next/link'

export default async function Page(
    props: {
        searchParams?: Promise<{
            query?: string
            page?: string
        }>
    }
) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || ''
    const intake = await getIntakeById(query)

    return (
        <section className='px-4 pt-8 h-full w-full flex flex-col items-center gap-2'>
            <div className='flex gap-2 lg:w-[720px] md:w-[480px] h-min mb-2'>
                <WarehouseSearch placeholder='Search intake id' />
                <Button>Search</Button>
            </div>

            {!intake && (
                <div className='w-full h-full flex justify-center items-center'>
                    <p className='text-muted-foreground'>No handling results were found</p>
                </div>
            )}

            {intake && (
                <Link
                    className='w-full flex justify-center'
                    href={`/warehouse/handling/${intake.intakeId}`}
                >
                    <Card className='w-3/4 h-fit shadow-none p-4'>
                        <div className='flex justify-between items-center'>
                            <div className='grid gap-2'>
                                <p className='text-muted-foreground'>Commodity</p>
                                <h3>{intake.commodity}</h3>
                            </div>
                            <div className='grid gap-2'>
                                <p className='text-muted-foreground'>Variety</p>
                                <h3>{intake.variety}</h3>
                            </div>
                            <div className='grid gap-2'>
                                <p className='text-muted-foreground'>Intake ID</p>
                                <h3>{intake.intakeId}</h3>
                            </div>
                            <div className='grid gap-2'>
                                <p className='text-muted-foreground'>Grade</p>
                                <h3>{intake.grade}</h3>
                            </div>
                            <div className='grid gap-2'>
                                <p className='text-muted-foreground'>Number of bags</p>
                                <h3>{intake.bagsIn}</h3>
                            </div>
                            <Button variant="outline">
                                Start Handling
                            </Button>
                        </div>
                    </Card>
                </Link>
            )}
        </section>
    )
}