"use client";


import { Label, Pie, PieChart } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import CustomLegend from "./customLegend";
import { calculatePieChartData } from "@/lib/utils";


interface CommodityChartProps {
    data: { seed: string; quantity: number; fill: string }[];
}


const CommodityChart = ({ data }: CommodityChartProps) => {
    const chartData = calculatePieChartData(data);
    const totalBags = data.reduce((sum, item) => sum + item.quantity, 0);


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
        },
        "Unknown Commodity": { // Added Unknown Commodity
            label: "Unknown Commodity",
            color: "#800000",
        }
    };


    return (
        <Card className="flex flex-col pb-6">
            <CardHeader className="items-start pb-0">
                <CardTitle className="text-[13px]">WAREHOUSE COMMODITY VALUE</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
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
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {totalBags}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                                    Bags
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>


                <div className="flex flex-col gap-2 mt-2">
                    {chartData.map((item, index) => (
                        <CustomLegend
                            key={index}
                            commodity={item.seed}
                            quantity={item.quantity} // Pass the actual quantity instead of percentage
                            color={item.fill}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};


export default CommodityChart;