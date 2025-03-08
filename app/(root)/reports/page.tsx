"use memo"

import StatisticsCard from "@/components/statisticsCard";
import { Anvil, Leaf, Sprout, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { ReportsTable } from "./reports-table";
import { searchParamsSchema } from "@/lib/validation";
import { SearchParams } from "@/types";
import { getDepositWithWarehouseReceipt } from "@/lib/actions/reports.action";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {

  const paramsToUse = searchParams instanceof Promise
    ? await searchParams
    : searchParams;
  const search = searchParamsSchema.parse(paramsToUse);

  const { data, total, pageCount } = await getDepositWithWarehouseReceipt(search);

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
      {/* <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        <StatisticsCard title={"Depositors"} value={uniqueClients.size.toString()} trend={"+2"} icon={Users} />
        <StatisticsCard title={"Commodities"} value={uniqueCommodities.size.toString()} trend={"+2"} icon={Leaf} />
        <StatisticsCard title={"Commodity Varieties"} value={uniqueVarieties.size.toString()} trend={"+2"} icon={Sprout} />
        <StatisticsCard title={"Net Weight"} value={formatNumber(totalNetWeight)} trend={"-416"} icon={Anvil} />
      </div> */}
      <ReportsTable data={data} pageCount={pageCount} total={total} />
    </section>
  );
}