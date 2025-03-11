import { getAccessLogs, getDeviceInfo } from "@/lib/actions/access.actions"
import { AccessTable } from "./access-table"
import { SearchParams } from "@/types"
import { accessLogsSearchParamsSchema } from "@/lib/validation";

export default async function Page({ searchParams } : { searchParams: SearchParams }) {
    const paramsToUse = searchParams instanceof Promise
        ? await searchParams
        : searchParams;
      const search = accessLogsSearchParamsSchema.parse(paramsToUse);

    const {data , total, pageCount} = await getAccessLogs(search);

    const devices = await getDeviceInfo()

    return (
        <div className="container mx-auto p-4">
            <AccessTable data={data} total={total} pageCount={pageCount} devices={devices} />
        </div>
    )
}
