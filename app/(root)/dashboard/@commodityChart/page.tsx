import React, { Suspense } from "react";
import CommodityChart from "@/components/charts/commodityChart";
import { getCommodityAggregation } from "@/lib/actions/dashboardActions/getCommodityAggregation.action";

export default function CommodityChartPage() {
  return (
    <Suspense fallback={<div>Loading Commodity Chart...</div>}>
      <CommodityChartFetcher />
    </Suspense>
  );
}

// Separate async fetching logic into its own component
async function CommodityChartFetcher() {
  const commodityData = await getCommodityAggregation();
  return <CommodityChart data={commodityData || []} />;
}
