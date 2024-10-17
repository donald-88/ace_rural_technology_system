import { getInventory } from "../../../lib/actions/inventory-actions"
import { Intake, columns } from "./columns"
import { DataTable } from "./data-table"



export default async function Page() {

  const intake = await JSON.parse(JSON.stringify(await getInventory()))

  console.log(intake)

  return (
    <div className="container mx-auto p-4">
      <DataTable columns={columns} data={intake} />
    </div>
  )
}
