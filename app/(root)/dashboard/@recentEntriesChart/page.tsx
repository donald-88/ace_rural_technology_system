import React from "react";
import RecentEntries from "@/components/recentEntries";
import { getRecentEntries } from "@/lib/actions/dashboardActions/recentEntries.action";

export default async function RecentEntriesRoute() {
  
  const recentEntry = await getRecentEntries();
  return <RecentEntries entries={recentEntry || []} />;
}