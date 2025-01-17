"use client";
import { useEffect } from "react";
import axios from "axios";

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

export default function Page() {
  useEffect(() => {
    // Trigger the API route to start recording when the app loads
    const triggerRecording = async () => {
      try {
        await axios.get("/api/footage/startRecording");
        console.log("Recording started automatically.");
      } catch (error) {
        console.error("Failed to start recording", error);
      }
    };

    triggerRecording();
  }, []);
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
          <RecentActivity />
        </div>
        <div className="w-1/3 h-full space-y-4">
          <CommodityChart />
          <RecentEntries />
        </div>
      </div>
    </section>
  );
}
