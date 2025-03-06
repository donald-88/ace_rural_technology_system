"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A multiple line chart"

const chartData = [
    { month: "January", desktop: 0, mobile: 0 },
    { month: "February", desktop: 0, mobile: 0 },
    { month: "March", desktop: 0, mobile: 0 },
    { month: "April", desktop: 0, mobile: 0 },
    { month: "May", desktop: 0, mobile: 0 },
    { month: "June", desktop: 0, mobile: 0 },
]

const chartConfig = {
    desktop: {
        label: "Smoke Sensor",
        color: "#5A923A",
    },
    mobile: {
        label: "Humidity",
        color: "#BABABA",
    },
}

const TempHumidChart = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-[13px]">WAREHOUSE CONDITIONS</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <YAxis
                            dataKey={"desktop"}
                            tickLine={false}
                            axisLine={false}
                        />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="desktop"
                            type="monotone"
                            stroke="hsl(103.89, 57.45%, 36.86%)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="mobile"
                            type="monotone"
                            stroke="var(--color-mobile)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default TempHumidChart