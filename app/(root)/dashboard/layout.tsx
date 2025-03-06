import MotionWatcher from "@/components/motionWatcher";

export default function DashboardLayout({ children, commodityChart, tempHumidChart, recentActivitiesChart, recentEntriesChart, statisticsCard }: {
  children: React.ReactNode;
  commodityChart: React.ReactNode;
  tempHumidChart: React.ReactNode;
  recentActivitiesChart: React.ReactNode;
  recentEntriesChart: React.ReactNode;
  statisticsCard: React.ReactNode;
}) {
  return (
    <section className="h-full w-full p-4 flex flex-col gap-4">
      <div>
        {statisticsCard}
      </div>
      <div className="flex gap-4">
        <div className="w-2/3 space-y-4">
          {tempHumidChart}
          {recentActivitiesChart}
        </div>
        <div className="w-1/3 h-full space-y-4">
          {commodityChart}
          {recentEntriesChart}
        </div>
      </div>
      {/* Optionally include the MotionWatcher here */}
      <MotionWatcher />
    </section>
  );
}
