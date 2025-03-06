import { columns } from "./columns";
import { DataTable } from "./data-table";
import StatisticsCard from "@/components/statisticsCard";
import { Anvil, Leaf, Sprout, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { getIntake } from "@/lib/actions/reports.action";

export default async function Page({ searchParams }: { searchParams: { page?: string; size?: string; commodity?: string; variety?: string } }) {
  const page = Number(searchParams.page) || 1
  const size = Number(searchParams.size) || 10
  const commodity = searchParams.commodity || "";
  const variety = searchParams.variety || "";

  const { data, count } = await getIntake(page, size);

  // Fixed variable names to match the property names in data
  const uniqueCommodities = new Set(data.map((item: { commodityGroup: string }) => item.commodityGroup));
  const uniqueVarieties = new Set(data.map((item: { commodityVariety: string }) => item.commodityVariety));
  const uniqueClients = new Set(data.map((item: { depositorId: string }) => item.depositorId));

  const totalNetWeight: number = data.reduce(
    (sum: number, entry: { netWeight?: string | number }) =>
      sum + (Number(entry.netWeight) || 0),
    0
  );

  return (
    <section className="container space-y-4 mx-auto p-2 sm:p-4">
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        <StatisticsCard title={"Depositors"} value={uniqueClients.size.toString()} trend={"+2"} icon={Users} />
        <StatisticsCard title={"Commodities"} value={uniqueCommodities.size.toString()} trend={"+2"} icon={Leaf} />
        <StatisticsCard title={"Commodity Varieties"} value={uniqueVarieties.size.toString()} trend={"+2"} icon={Sprout} />
        <StatisticsCard title={"Net Weight"} value={formatNumber(totalNetWeight)} trend={"-416"} icon={Anvil} />
      </div>
      <DataTable columns={columns} data={data} />
    </section>
  );
}