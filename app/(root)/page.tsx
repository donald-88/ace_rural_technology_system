"use client"

import CommodityChart from "@/components/commodityChart"
import RecentActivity from "@/components/recentActivity"
import RecentEntries from "@/components/recentEntries"
import StatisticsCard from "@/components/statisticsCard"
import TempHumidChart from "@/components/tempHumidChart"
import { ArrowDownToLine, ArrowUpFromLine, Droplet, Thermometer, ThermometerSun } from "lucide-react"

export default function Page() {
    return (
        <section className='h-full w-full p-4 flex flex-col gap-4'>
            <div className="flex gap-4">
                <StatisticsCard title={"Bags In"} value={"250"} trend="23%"  children={<ArrowDownToLine size="16" color="#5D5F5D" strokeWidth="2" />} />
                <StatisticsCard title={"Bags Out"} value={"250"} trend="15%" children={<ArrowUpFromLine size="16" color="#5D5F5D" strokeWidth="2" />} />
                <StatisticsCard title={"Temperature"} value={"23"} trend="-2.5%" children={<ThermometerSun size="16" color="#5D5F5D" strokeWidth="2" />} />
                <StatisticsCard title={"Humidity"} value={"30%"} trend="-7%" children={<Droplet size="16" color="#5D5F5D" strokeWidth="2" />} />
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