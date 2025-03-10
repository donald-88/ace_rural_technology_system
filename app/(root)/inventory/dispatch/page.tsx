import { getDispatch } from "@/lib/actions/dispatch.actions";
import { SearchParams } from "@/types";
import { DispatchTable } from "./dispatch-table";
import { dispatchSearchParamsSchema } from "@/lib/validation";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const paramsToUse = searchParams instanceof Promise
    ? await searchParams
    : searchParams;
  const search = dispatchSearchParamsSchema.parse(paramsToUse);
  const { data, total, pageCount } = await getDispatch(search)

  return (
    <section className="container mx-auto p-2 sm:p-4">
      <DispatchTable data={data} total={total} pageCount={pageCount} />
    </section>
  )
}