import { getIntake } from "@/lib/actions/intake.actions";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import StatisticsCard from "@/components/statisticsCard";
import { Anvil, Leaf, Sprout, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Share1Icon, Share2Icon } from "@radix-ui/react-icons";
import { formatNumber } from "@/lib/utils";
import { Suspense } from "react";
import DataTableLoading from "@/components/data-table/data-table-loading";

export default async function Page() {

  const data = await getIntake()

  const uniqueCommodities = new Set(data.map((item: { commodity: string }) => item.commodity))
  const uniqueVarieties = new Set(data.map((item: { variety: string }) => item.variety))
  const uniqueClients = new Set(data.map((item: { clientId: string }) => item.clientId))
  const totalNetWeight: number = data.reduce((sum: number, entry: { netWeight?: number }) => sum + (entry.netWeight || 0), 0);

  return (
    <section className="w-full overflow-x-hidden">
      <div className="container grid gap-4 mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-13px"></h3>
          <div className="flex gap-2">
            <Button variant={"outline"} size={"sm"} className="flex gap-2">
              <Share1Icon />
              <p>Share</p>
            </Button>
            <Button size={"sm"} className="flex gap-2">
              <Share2Icon /> Export
            </Button>
          </div>
        </div>
        <div className="flex gap-4">
          <StatisticsCard title={"Holders"} value={uniqueClients.size.toString()} trend={"+2"} icon={Users} />
          <StatisticsCard title={"Commodities"} value={uniqueCommodities.size.toString()} trend={"+2"} icon={Leaf} />
          <StatisticsCard title={"Commodity Varieties"} value={uniqueVarieties.size.toString()} trend={"+2"} icon={Sprout} />
          <StatisticsCard title={"Net Weight"} value={formatNumber(totalNetWeight)} trend={"-416"} icon={Anvil} />
        </div>
        <Suspense fallback={<DataTableLoading/>}>
          <DataTable columns={columns} data={data} />
        </Suspense>
      </div>
    </section>
  );
}
