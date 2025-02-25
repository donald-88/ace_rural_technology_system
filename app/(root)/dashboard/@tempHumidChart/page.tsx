import React, { Suspense } from "react";
import TempHumidChart from "@/components/charts/tempHumidChart";

export default async function TempHumidChartPage() {
  return (
    <Suspense fallback={<div>Loading Temperature & Humidity Chart...</div>}>
      <TempHumidChart />
    </Suspense>
  );
}
