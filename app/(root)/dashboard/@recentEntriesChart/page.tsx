import React from "react";
import RecentEntries from "@/components/accessLogsChart";
import { getRecentEntries } from "@/lib/actions/dashboardActions/accessLogsChart.action";

export default async function RecentEntriesRoute() {
  
  const recentEntry = await getRecentEntries();
  return <RecentEntries entries={recentEntry || []} />;
}