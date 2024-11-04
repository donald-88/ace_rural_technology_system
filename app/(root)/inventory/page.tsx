import { getInventory } from "../../../lib/actions/inventory.actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"



export default async function Page() {

  const intake = await getInventory()
  return (
    <section className="container mx-auto p-4">
      <DataTable columns={columns} data={intake} />
    </section>
  )
}
