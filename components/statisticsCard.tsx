import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { ArrowUp } from "lucide-react"

interface StatisticsCardProps {
    title: string
    children: React.ReactNode
}

const StatisticsCard = ({ title, children }: StatisticsCardProps) => {
    return (
        <Card className="flex flex-col gap-2 w-1/2 p-4 shadow-none">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#5D5F5D]">{title}</h3>
                <Card className="p-2 w-fit">
                    {children}
                </Card>
            </div>
            <h1>574</h1>
            <Badge className={"flex w-fit h-fit gap-0.5 border-green-600"} variant={"outline"}>
                <ArrowUp size="12" className="text-green-600" />
                <p className="text-xs text-green-600 font-normal">23%</p>
            </Badge>
        </Card>
    )
}

export default StatisticsCard