import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"

const logs = [
    {
        name: "John Phiri",
        commodity: "Maize",
        volume: "1000",
        moisture: "0.008",
        bags: "100",
        date: "2023-08-01",
    },
    {
        name: "Jenifer Nyirenda",
        commodity: "Beans",
        volume: "250",
        moisture: "0.0003",
        bags: "10",
        date: "2024-04-02"
    },
    {
        name: "John Phiri",
        commodity: "Maize",
        volume: "1000",
        moisture: "0.008",
        bags: "100",
        date: "2023-08-01",
    },
    {
        name: "Maziko Banda",
        commodity: "Soya Beans",
        volume: "43",
        moisture: "0.007",
        bags: "12",
        date: "2024-04-01"
    },
    {
        name: "John Phiri",
        commodity: "Maize",
        volume: "1000",
        moisture: "0.008",
        bags: "100",
        date: "2023-08-01",
    },
]

const RecentActivity = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-[13px] flex justify-between items-center">RECENT ACTIVITY<button><Badge className={"px-3 py-1.5"} variant={'outline'}>See All</Badge></button></CardTitle>
            </CardHeader>
            <Table>
                <TableHeader>
                    <TableRow className="text-xs">
                        <TableHead>#</TableHead>
                        <TableHead className="w-[100px]">NAME</TableHead>
                        <TableHead>COMMODITY</TableHead>
                        <TableHead>VOLUME(Kg)</TableHead>
                        <TableHead>MOISTURE</TableHead>
                        <TableHead>NO of BAGS</TableHead>
                        <TableHead>DATE</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.map((log, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="flex flex-col whitespace-nowrap"><p>{log.name}</p></TableCell>
                            <TableCell>{log.commodity}</TableCell>
                            <TableCell>{log.volume}</TableCell>
                            <TableCell>{log.moisture}</TableCell>
                            <TableCell>{log.bags}</TableCell>
                            <TableCell>{log.date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}

export default RecentActivity