import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
    const items = new Array(10).fill(0)
  return (
    <div className='w-full p-4'>
        {
              items.map((item, index) => (
                  <Skeleton key={index} className='w-full h-12 mb-2' />
              ))
        }
    </div>
  )
}
