import { Card, CardContent, CardHeader } from '@/components/ui/card'

const RecentEntriesSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex justify-between">
        <div className="text-[13px] flex justify-between items-center w-full">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array(4).fill(0).map((_, index) => (
          <div className="flex flex-col" key={index}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default RecentEntriesSkeleton