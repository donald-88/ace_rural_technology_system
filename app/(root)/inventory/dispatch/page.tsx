import { getDispatch } from "@/lib/actions/dispatch.actions";
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function Page() {
  const dispatch = await getDispatch()
  return (
    <section className="container mx-auto p-4">
      <DataTable columns={columns} data={dispatch} />
    </section>
  )
}