import React, { Suspense } from "react";
import RecentEntries from "@/components/recentEntries";
import { getRecentEntries } from "@/lib/actions/dashboardActions/recentEntries.action";

export default async function CommodityChartPage() {
  return (
    <Suspense fallback={<div>Loading Recent Entries...</div>}>
      <RecentEntriesFetcher />
    </Suspense>
  );
}

// Extract data fetching into a separate component (must be a Client Component if it uses state/hooks)
async function RecentEntriesFetcher() {
  const recentEntry = await getRecentEntries();
  return <RecentEntries entries={recentEntry || []} />;
}
