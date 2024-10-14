import { Card } from "./ui/card"
import { MoveUpRight } from "lucide-react"

interface StatisticsCardProps {
    title: string
    children: React.ReactNode
}

const StatisticsCard = ({ title, children }: StatisticsCardProps) => {
    return (
        <Card className="flex flex-col justify-center gap-4 w-1/2 p-4 shadow-none">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#5D5F5D]">{title}</h3>
                <Card className="p-2 w-fit">
                    {children}
                </Card>
            </div>
            <div className="flex justify-between items-center">
                <h1>574</h1>
                <div className={"flex items-center w-fit h-fit gap-0.5 border-green-600"}>
                    <MoveUpRight size="12" className="text-green-600" />
                    <p className="text-xs text-green-600 font-normal">23%</p>
                </div>
            </div>
        </Card>
    )
}

export default StatisticsCard