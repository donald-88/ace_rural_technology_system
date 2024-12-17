import { getIntake } from "@/lib/actions/intake.actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"



export default async function Page() {

  const intake = await getIntake()
  return (
    <section className="container mx-auto p-4">
      <DataTable columns={columns} data={intake as any} />
    </section>
  )
}