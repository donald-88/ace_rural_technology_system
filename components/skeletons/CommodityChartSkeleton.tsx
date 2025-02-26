import { Card, CardContent, CardHeader } from '@/components/ui/card'

const CommodityChartSkeleton = () => {
  return (
    <Card className="flex flex-col pb-6 animate-pulse">
      <CardHeader className="items-start pb-0">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[250px] flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-white flex flex-col items-center justify-center">
              <div className="h-6 w-16 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-4 w-12 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default CommodityChartSkeleton