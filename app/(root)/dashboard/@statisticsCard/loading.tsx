import StatisticsCardSkeleton from "@/components/skeletons/StatisticsCardSkeleton"

export default function Loading() {
  return (
    <div className="flex gap-4">
      <StatisticsCardSkeleton />
      <StatisticsCardSkeleton />
      <StatisticsCardSkeleton />
      <StatisticsCardSkeleton />
    </div>
  )
}
