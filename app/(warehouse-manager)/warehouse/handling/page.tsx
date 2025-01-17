import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import WarehouseSearch from '@/components/warehouseSearchBar'
import { getIntakeById } from '@/lib/actions/intake.actions'
import { Edit } from 'lucide-react'

export default async function Page({
    searchParams
}: {
    searchParams?: {
        query?: string
        page?: string
    }
}) {
    const query = searchParams?.query || ''
    const intake = await getIntakeById(query)

    return (
        <section className='px-4 pt-8 h-full w-full flex flex-col items-center'>
            <div className='flex gap-2 lg:w-[720px] md:w-[480px] h-min mb-2'>
                <WarehouseSearch placeholder='Search intake id' />
                <Button>Search</Button>
            </div>
            {intake ? (
                <Card className='w-full h-fit shadow-none p-4'>
                    
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='text-muted-foreground'>Commodity</p>
                            <h3>{intake.commodity}</h3>
                        </div>

                        <div>
                            <p className='text-muted-foreground'>Variety</p>
                            <h3>{intake.variety}</h3>
                        </div>

                        <div>
                            <p className='text-muted-foreground'>Intake ID</p>
                            <h3>{intake.id}</h3>
                        </div>

                        <div>
                            <p className='text-muted-foreground'>Grade</p>
                            <h3>{intake.grade}</h3>
                        </div>

                        <div>
                            <p className='text-muted-foreground'>Bag Count</p>
                            <h3>{intake.number_of_bags}</h3>
                        </div>

                        <Button variant={"outline"} className='p-3.5'>
                            <Edit size={16} color='grey'/>
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className='w-full h-full flex justify-center items-center'>
                    <p className='text-muted-foreground'>No handling results were found</p>
                </div>
            )}
        </section>
    )
}
