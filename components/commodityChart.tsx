"use client"

import { Pie, PieChart } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
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
        <Card className="flex flex-col pb-4">
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
                            innerRadius={60}
                            outerRadius={100}
                        />
                    </PieChart>
                </ChartContainer>

                <div className="flex flex-col gap-2">
                    <CustomLegend commodity="Maize" quantity="274" weight="537Kg" />
                    <CustomLegend commodity="Rice" quantity="174" weight="537Kg" />
                    <CustomLegend commodity="Groundnuts" quantity="74" weight="490Kg" />
                    <CustomLegend commodity="Soya Beans" quantity="206" weight="470Kg" />
                </div>
            </CardContent>
        </Card>
    )
}

export default CommodityChart