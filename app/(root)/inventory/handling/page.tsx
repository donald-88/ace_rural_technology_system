import { getHandling } from "@/lib/actions/handling.actions"
import { HandlingTable } from "./handling-table"
import { SearchParams } from "@/types"
import { handlingSearchParamsSchema } from "@/lib/validation";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const paramsToUse = searchParams instanceof Promise
    ? await searchParams
    : searchParams;
  const search = handlingSearchParamsSchema.parse(paramsToUse);

  const { data, total, pageCount } = await getHandling(search)
  return (
    <section className="container mx-auto p-2 sm:p-4">
      <HandlingTable data={data} total={total} pageCount={pageCount} />
    </section>
  )
}