import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Card, CardHeader } from "@/components/ui/card"
  
  const RecentActivitySkeleton = () => {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="text-[13px] flex justify-between items-center">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead><div className="h-3 w-4 bg-gray-200 rounded"></div></TableHead>
              <TableHead><div className="h-3 w-16 bg-gray-200 rounded"></div></TableHead>
              <TableHead><div className="h-3 w-16 bg-gray-200 rounded"></div></TableHead>
              <TableHead><div className="h-3 w-20 bg-gray-200 rounded"></div></TableHead>
              <TableHead><div className="h-3 w-20 bg-gray-200 rounded"></div></TableHead>
              <TableHead><div className="h-3 w-16 bg-gray-200 rounded"></div></TableHead>
              <TableHead><div className="h-3 w-24 bg-gray-200 rounded"></div></TableHead>
              <TableHead><div className="h-3 w-16 bg-gray-200 rounded"></div></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><div className="h-4 w-4 bg-gray-200 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-16 bg-gray-200 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-24 bg-gray-200 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-20 bg-gray-200 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-16 bg-gray-200 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-12 bg-gray-200 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-16 bg-gray-200 rounded"></div></TableCell>
                <TableCell><div className="h-4 w-20 bg-gray-200 rounded"></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    )
  }
  
  export default RecentActivitySkeleton