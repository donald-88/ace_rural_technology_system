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

  const { data, total, pageCount, totalDepositors, totalCommodityGroups, totalCommodityVarieties, totalNetWeight } = await getDepositWithWarehouseReceipt(search);


  return (
    <section className="container space-y-4 mx-auto p-2 sm:p-4">
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        <StatisticsCard title={"Depositors"} value={totalDepositors.toString()} trend={"+2"} icon={Users} />
        <StatisticsCard title={"Commodities"} value={totalCommodityGroups.toString()} trend={"+2"} icon={Leaf} />
        <StatisticsCard title={"Commodity Varieties"} value={totalCommodityVarieties.toString()} trend={"+2"} icon={Sprout} />
        <StatisticsCard title={"Net Weight"} value={formatNumber(Number(totalNetWeight))} trend={"-416"} icon={Anvil} />
      </div>
      <ReportsTable data={data} pageCount={pageCount} total={total} />
    </section>
  );
}