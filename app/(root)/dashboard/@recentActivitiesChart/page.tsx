import React from "react";
import RecentActivity from "@/components/recentActivity";
import { getRecentActivities } from "@/lib/actions/dashboardActions/recentActivity.action";

export default async function RecentActivitiesRoute() {

  const recentActivity = await getRecentActivities();
  return <RecentActivity activities={recentActivity || []} />;
}
