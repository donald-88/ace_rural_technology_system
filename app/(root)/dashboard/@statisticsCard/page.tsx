// app/dashboard/@statisticsCard/page.tsx
import { Suspense } from "react";
import StatisticsCard from "@/components/statisticsCard";
import {
  AirVent,
  ArrowDownToLine,
  ArrowUpFromLine,
  Droplet,
  ThermometerSun,
} from "lucide-react";
import StatisticsCardSkeleton from "@/components/skeletons/StatisticsCardSkeleton";

const fetchDataForStat1 = async () => {
  return { value: "0", trend: "0%", icon: ArrowDownToLine };
};
const fetchDataForStat2 = async () => {
  return { value: "0", trend: "0%", icon: ArrowUpFromLine };
};
const fetchDataForStat3 = async () => {
  return { value: "0", trend: "0%", icon: AirVent };
};
const fetchDataForStat4 = async () => {
  return { value: "0%", trend: "0%", icon: Droplet };
};

export default function StatisticsCardRoute() {
  return (
    <div className="flex gap-4">
      <Suspense fallback={<StatisticsCardSkeleton />}>
        <StatCard fetchFn={fetchDataForStat1} title="Bags In" />
      </Suspense>
      <Suspense fallback={<StatisticsCardSkeleton />}>
        <StatCard fetchFn={fetchDataForStat2} title="Bags Out" />
      </Suspense>
      <Suspense fallback={<StatisticsCardSkeleton />}>
        <StatCard fetchFn={fetchDataForStat3} title="Smoke Sensor" />
      </Suspense>
      <Suspense fallback={<StatisticsCardSkeleton />}>
        <StatCard fetchFn={fetchDataForStat4} title="Humidity" />
      </Suspense>
    </div>
  );
}

// Create a wrapper component to handle async data fetching
async function StatCard({
  fetchFn,
  title,
}: {
  fetchFn: () => Promise<any>;
  title: string;
}) {
  const data = await fetchFn();
  return <StatisticsCard {...data} title={title} />;
}
