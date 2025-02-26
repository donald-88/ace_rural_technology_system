import { Card } from "@/components/ui/card"

const StatisticsCardSkeleton = () => {
  return (
    <Card className="flex flex-col justify-center gap-4 w-1/2 p-4 shadow-none animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <Card className="p-2 w-8 h-8 shadow-none bg-gray-200"></Card>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-6 w-16 bg-gray-200 rounded"></div>
        <div className="flex items-center w-fit h-fit gap-0.5">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    </Card>
  )
}

export default StatisticsCardSkeleton