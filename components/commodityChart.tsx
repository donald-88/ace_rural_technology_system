"use client"

import { Label, Pie, PieChart } from "recharts"
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
import CustomLegend from "./customLegend"

const chartData = [
    { seed: "Maize", quantity: 275, fill: "#459428" },
    { seed: "Rice", quantity: 200, fill: "#FF9F40" },
    { seed: "Groundnuts", quantity: 187, fill: "#0D2535" },
    { seed: "Soya", quantity: 173, fill: "#5388D8" },
]
const chartConfig = {
    quantity: {
        label: "Quantity",
    },
    Maize: {
        label: "Maize",
        color: "#459428",
    },
    Rice: {
        label: "Rice",
        color: "#FF9F40",
    },
    Groundnuts: {
        label: "Groundnuts",
        color: "#0D2535",
    },
    Soya: {
        label: "Soya",
        color: "#5388D8",
    }
}

const CommodityChart = () => {
    return (
        <Card className="flex flex-col pb-6">
            <CardHeader className="items-start pb-0">
                <CardTitle className="text-[13px]">WAREHOUSE COMMODITY VALUE</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="quantity"
                            nameKey="seed"
                            innerRadius={85}
                            outerRadius={100}
                            cornerRadius={5}
                            paddingAngle={4}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    698
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Bags
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>

                    </PieChart>

                </ChartContainer>

                <div className="flex flex-col gap-2 mt-2">
                    <CustomLegend commodity="Maize" quantity="27%" color="#459428" />
                    <CustomLegend commodity="Rice" quantity="17%" color="#FF9F40" />
                    <CustomLegend commodity="Groundnuts" quantity="74%" color="#0D2535" />
                    <CustomLegend commodity="Soya Beans" quantity="20%" color="#5388D8" />
                </div>
            </CardContent>
        </Card>
    )
}

export default CommodityChart