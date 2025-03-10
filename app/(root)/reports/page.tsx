"use memo"

import StatisticsCard from "@/components/statisticsCard";
import { Anvil, Leaf, Sprout, Users } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { ReportsTable } from "./reports-table";
import { searchParamsSchema } from "@/lib/validation";
import { SearchParams } from "@/types";
import { getDepositWithWarehouseReceipt, getFilteredOptions } from "@/lib/actions/reports.action";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {

  const paramsToUse = searchParams instanceof Promise
    ? await searchParams
    : searchParams;
  const search = searchParamsSchema.parse(paramsToUse);

  const depositData = await getDepositWithWarehouseReceipt(search);
  const filteredOptionsData = await getFilteredOptions();

  const [deposit, filteredOptions] = await Promise.all([depositData, filteredOptionsData]);


  return (
    <section className="container space-y-4 mx-auto p-2 sm:p-4">
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        <StatisticsCard title={"Depositors"} value={deposit.totalDepositors.toString()} trend={"+2"} icon={Users} />
        <StatisticsCard title={"Commodities"} value={deposit.totalCommodityGroups.toString()} trend={"+2"} icon={Leaf} />
        <StatisticsCard title={"Commodity Varieties"} value={deposit.totalCommodityVarieties.toString()} trend={"+2"} icon={Sprout} />
        <StatisticsCard title={"Net Weight"} value={formatNumber(Number(deposit.totalNetWeight))} trend={"-416"} icon={Anvil} />
      </div>
      <ReportsTable data={deposit.data} pageCount={deposit.pageCount} total={deposit.total}
        uniqueHolders={filteredOptions.uniqueHolders.filter((holder): holder is string => holder !== null)}
        uniqueDepositors={filteredOptions.uniqueDepositors.filter((depositor): depositor is string => depositor !== null)}
        uniqueCommodities={filteredOptions.uniqueCommodityGroups.filter((commodity): commodity is string => commodity !== null)}
        uniqueVarieties={filteredOptions.uniqueCommodityVarieties.filter((commodity): commodity is string => commodity !== null)}
      />
    </section>
  );
}