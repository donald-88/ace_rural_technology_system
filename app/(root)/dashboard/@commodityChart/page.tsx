import React from "react";
import CommodityChart from "@/components/charts/commodityChart";
import { getCommodityAggregation } from "@/lib/actions/dashboardActions/getCommodityAggregation.action";

export default async function CommodityChartRoute() {

  const commodityData = await getCommodityAggregation();
  return <CommodityChart data={commodityData || []} />;
}