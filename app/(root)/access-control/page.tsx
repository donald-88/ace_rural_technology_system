import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const logs = [
    {
        name: "John Phiri",
        email: "johnphiri@gmail.com",
        reason: "Inspection",
        role: "Warehouse Manager",
        date: "2024-10-01",
        timeOfEntry: "13:54",
        timeOfExit: "14:12",
    },
    {
        name: "John Phiri",
        email: "johnphiri@gmail.com",
        reason: "Inspection",
        role: "Warehouse Manager",
        date: "2024-10-01",
        timeOfEntry: "13:54",
        timeOfExit: "14:12",
    },
    {
        name: "Joseph Chikwamba",
        email: "josephchikwamba@gmail.com",
        reason: "Disinfection",
        role: "External",
        date: "2024-10-01",
        timeOfEntry: "13:54",
        timeOfExit: "14:12",
    }
]

const AccessControl = () => {
    return (
        <section className='h-full w-full'>
            <div className="p-4 flex flex-col items-start gap-4">
                <Card className="shadow-none w-full">
                    <Table>
                        <TableHeader className="">
                            <TableRow className="text-sm font-bold">
                                <TableHead><Checkbox /></TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead className="w-[100px]">NAME</TableHead>
                                <TableHead>EMAIL</TableHead>
                                <TableHead>REASON</TableHead>
                                <TableHead>ROLE</TableHead>
                                <TableHead>DATE</TableHead>
                                <TableHead>TIME OF ENTRY</TableHead>
                                <TableHead>TIME OF EXIT</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log, index) => (
                                <TableRow key={index} className="text-sm text-secondary">
                                    <TableCell><Checkbox className="" /></TableCell>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="font-normal flex flex-col whitespace-nowrap">{log.name}</TableCell>
                                    <TableCell>{log.email}</TableCell>
                                    <TableCell className="font-normal">{log.reason}</TableCell>
                                    <TableCell>{log.role}</TableCell>
                                    <TableCell>{log.date}</TableCell>
                                    <TableCell>{log.timeOfEntry}</TableCell>
                                    <TableCell>{log.timeOfExit}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                <Pagination className={"text-secondary"}>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </section>
    )
}

export default AccessControl