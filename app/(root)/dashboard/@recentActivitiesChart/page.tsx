import React, { Suspense } from "react";
import RecentActivity from "@/components/recentActivity";
import { getRecentActivities } from "@/lib/actions/dashboardActions/recentActivity.action";

export default function CommodityChartPage() {
  return (
    <Suspense fallback={<div>Loading Recent Activity...</div>}>
      <RecentActivityFetcher />
    </Suspense>
  );
}

// Separate async fetching logic into its own component
async function RecentActivityFetcher() {
  const recentActivity = await getRecentActivities();
  return <RecentActivity activities={recentActivity || []} />;
}
