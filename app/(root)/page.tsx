"use client";
import { useEffect, useState } from "react";
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
  const [recordingStarted, setRecordingStarted] = useState(false); // State to check API trigger

  useEffect(() => {
    const triggerRecording = async () => {
      try {
        if (!recordingStarted) {
          const response = await axios.post("/api/footage/startRecording");
          console.log(response.data.message);
          setRecordingStarted(true); // Mark as triggered
        }
      } catch (error) {
        console.error("Failed to start recording", error);
      }
    };

    triggerRecording();
  }, [recordingStarted]);
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