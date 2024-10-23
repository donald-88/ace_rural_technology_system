import { cn } from "@/lib/utils"
import { Card } from "./ui/card"
import {  TrendingDown, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatisticsCardProps {
    title: string
    value: string
    trend: string
    icon: LucideIcon
}

const StatisticsCard = ({ title, value, trend, icon: Icon }: StatisticsCardProps) => {

    const isNegative = trend.includes("-")
    return (
        <Card className="flex flex-col justify-center gap-4 w-1/2 p-4 shadow-none">
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#5D5F5D]">{title}</h3>
                <Card className="p-2 w-fit">
                    <Icon size="16" color="#5D5F5D" strokeWidth="2" />
                </Card>
            </div>
            <div className="flex justify-between items-center">
                <h1>{value}</h1>
                <div className={"flex items-center w-fit h-fit gap-0.5 border-green-600"}>
                    {
                        isNegative? <TrendingDown className="text-red-500" size={16}/>: <TrendingUp className="text-green-600" size={16}/>
                    }
                    <p className={cn("text-xs text-green-600 font-normal", isNegative && "text-red-500")}>{trend}</p>
                </div>
            </div>
        </Card>
    )
}

export default StatisticsCard