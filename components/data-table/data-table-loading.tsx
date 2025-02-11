import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const DataTableLoading = () => {
    return (
        <section className="p-4">
            {/* Toolbar skeleton */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-8 w-[100px]" />
            </div>

            <div className="rounded-md border mb-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* Adjust the number of columns based on your table */}
                            {Array.from({ length: 8 }).map((_, i) => (
                                <TableHead key={i}>
                                    <Skeleton className="h-4 w-[100px]" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={i}>
                                {Array.from({ length: 8 }).map((_, j) => (
                                    <TableCell key={j}>
                                        <Skeleton className="h-4 w-[100px]" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[100px]" />
                <Skeleton className="h-8 w-[200px]" />
            </div>
        </section>
    )
}

export default DataTableLoading