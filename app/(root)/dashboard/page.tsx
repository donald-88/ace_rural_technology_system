// app/dashboard/page.tsx (or wherever your dashboard page is located)
import CommodityChart from "@/components/commodityChart";
import RecentActivity from "@/components/recentActivity";
import RecentEntries from "@/components/recentEntries";
import StatisticsCard from "@/components/statisticsCard";
import TempHumidChart from "@/components/tempHumidChart";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Droplet,
  ThermometerSun,
} from "lucide-react";

import { getCommodityAggregation } from "@/lib/actions/dashboardActions/getCommodityAggregation.action";
import { getRecentActivities } from "@/lib/actions/dashboardActions/recentActivity.action";

export default async function Dashboard() {
  // Dynamic data for recent entries
  const recentEntriesData = [
    { name: "Jacob Samalani", role: "Warehouse Manager" },
    { name: "Gift Banda Samalani", role: "Warehouse Attendant" },
    { name: "Judith Nyirenda", role: "Cleaning Staff" },
    { name: "Esther Phiri", role: "Inventory Supervisor" },
  ];

  // Await the aggregated commodity data
  const commodityData = await getCommodityAggregation();

  // Fetch the five most recent activities across intakes, handlings, and dispatches.
  const recentActivities = await getRecentActivities();

  return (
    <section className="h-full w-full p-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <StatisticsCard
          title={"Bags In"}
          value={"250"}
          trend="23%"
          icon={ArrowDownToLine}
        />
        <StatisticsCard
          title={"Bags Out"}
          value={"250"}
          trend="15%"
          icon={ArrowUpFromLine}
        />
        <StatisticsCard
          title={"Temperature"}
          value={"23"}
          trend="-2.5%"
          icon={ThermometerSun}
        />
        <StatisticsCard
          title={"Humidity"}
          value={"30%"}
          trend="-7%"
          icon={Droplet}
        />
      </div>

      <div className="flex gap-4">
        <div className="w-2/3 space-y-4">
          <TempHumidChart />
          {/* Pass the fetched recent activities data */}
          <RecentActivity activities={recentActivities} />
        </div>
        <div className="w-1/3 h-full space-y-4">
          <CommodityChart data={commodityData} />
          {/* Pass the recent entries data */}
          <RecentEntries entries={recentEntriesData} />
        </div>
      </div>
    </section>
  );
}
