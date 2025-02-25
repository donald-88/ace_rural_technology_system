import { getIntake } from "@/lib/actions/intake.actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"



export default async function Page({searchParams}: {searchParams: {[key: string]: string | string[] | undefined}}) {
  const intake = await getIntake()

  // const page = searchParams['page'] ?? '1'
  // const per_page = searchParams['per_page'] ?? '10'

  // const start = (Number(page) - 1) * Number(per_page)
  // const end = start + Number(per_page)
  // const data = intake.slice(start, end)
  
  return (
    <section className="container mx-auto p-4">
      <DataTable columns={columns} data={intake} />
    </section>
  )
}