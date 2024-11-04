import { getAccessLogs } from "@/lib/actions/access.actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function Page() {
    const data = await getAccessLogs()

    return (
        <div className="container mx-auto p-4">
            <DataTable columns={columns} data={data} />
        </div>
    )
}
