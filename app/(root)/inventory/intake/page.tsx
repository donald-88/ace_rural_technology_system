import { searchParamsSchema } from "@/lib/validation";
import { IntakeTable } from "./intake-table"
import { getDepositWithWarehouseReceipt, getFilteredOptions } from "@/lib/actions/reports.action";
import { SearchParams } from "@/types";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {

  const paramsToUse = searchParams instanceof Promise
    ? await searchParams
    : searchParams;
  const search = searchParamsSchema.parse(paramsToUse);
  const depositData = await getDepositWithWarehouseReceipt(search);
  const filteredOptionsData = await getFilteredOptions();

  const [deposit, filteredOptions] = await Promise.all([depositData, filteredOptionsData]);

  return (
    <section className="container mx-auto p-2 sm:p-4">
      <IntakeTable data={deposit.data} total={deposit.total} pageCount={deposit.pageCount}
        uniqueDepositors={filteredOptions.uniqueDepositors.filter((depositor): depositor is string => depositor !== null)}
        uniqueCommodities={filteredOptions.uniqueCommodityGroups.filter((commodity): commodity is string => commodity !== null)}
        uniqueVarieties={filteredOptions.uniqueCommodityVarieties.filter((commodity): commodity is string => commodity !== null)} />
    </section>
  )
}