"use client"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface CustomLegendProps {
    sensor: string
    data: {
        month: string
        reading: number
    }[]
}

const SensorBarChart = ({ sensor, data }: CustomLegendProps) => {
    
    const chartConfig = {
        reading: {
            label: "Reading",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig
    return (
        <Card className="w-1/3">
            <CardHeader>
                <CardTitle className="text-[13px]">{sensor} Chart</CardTitle>
                <CardDescription>Average {sensor}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="reading" fill="hsl(102.86 54.97% 37.45%)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}

export default SensorBarChart