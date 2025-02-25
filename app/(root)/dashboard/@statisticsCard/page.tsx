// pages/dashboard/index.tsx
import { Suspense } from 'react'
import StatisticsCard from '@/components/statisticsCard'
import { ArrowDownToLine, ArrowUpFromLine, Droplet, ThermometerSun } from 'lucide-react'

// Mock fetching data function
const fetchDataForStat1 = () => ({ value: '250', trend: '23%', icon: ArrowDownToLine });
const fetchDataForStat2 = () => ({ value: '250', trend: '15%', icon: ArrowUpFromLine });
const fetchDataForStat3 = () => ({ value: '23', trend: '-2.5%', icon: ThermometerSun });
const fetchDataForStat4 = () => ({ value: '30%', trend: '-7%', icon: Droplet });

export default function Dashboard() {
  return (
    <div className="flex gap-4">
      {/* Slot for each stat */}
      <Suspense fallback={<div>Loading...</div>}>
        <StatisticsCard {...fetchDataForStat1()} title="Bags In" />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <StatisticsCard {...fetchDataForStat2()} title="Bags Out" />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <StatisticsCard {...fetchDataForStat3()} title="Temperature" />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <StatisticsCard {...fetchDataForStat4()} title="Humidity" />
      </Suspense>
    </div>
  );
}
