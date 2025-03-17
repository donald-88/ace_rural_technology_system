import { getAccessLogs, getDeviceInfo } from "@/lib/actions/access.actions"
import { AccessTable } from "./access-table"
import { SearchParams } from "@/types"
import { accessLogsSearchParamsSchema } from "@/lib/validation";

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
    try {
        const paramsToUse = searchParams instanceof Promise
            ? await searchParams
            : searchParams;
        const search = accessLogsSearchParamsSchema.parse(paramsToUse);

        const result = await getAccessLogs(search);
        const devices = await getDeviceInfo();

        if ('error' in result) {
            return (
                <div className="container mx-auto p-4">
                    <div className="flex items-center justify-center p-8 text-red-600">
                        Failed to load access logs. Please try again later.
                    </div>
                </div>
            );
        }

        return (
            <div className="container mx-auto p-4">
                <AccessTable
                    data={result.data}
                    total={result.total}
                    pageCount={result.pageCount}
                    devices={devices}
                />
            </div>
        );
    } catch (error) {
        console.error("Error in access logs page:", error);
        return (
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center p-8 text-red-600">
                    An error occurred while loading the page. Please try again later.
                </div>
            </div>
        );
    }
}
