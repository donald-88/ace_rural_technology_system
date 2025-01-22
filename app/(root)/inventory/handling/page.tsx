import { getHandling } from "@/lib/actions/handling.actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"



export default async function Page() {

  const handling = await getHandling()
  return (
    <section className="container mx-auto p-4">
      <DataTable columns={columns} data={handling} />
    </section>
  )
}