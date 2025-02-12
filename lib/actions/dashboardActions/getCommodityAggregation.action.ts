// getCommodityAggregation.action.ts
"use server";

import Handling from "@/models/handling";
import connectDB from "../../mongodb";

// Mapping for commodity colors. Adjust as needed.
const commodityColors: { [key: string]: string } = {
  Maize: "#459428",
  Rice: "#FF9F40",
  Groundnuts: "#0D2535",
  Soya: "#5388D8",
};

export const getCommodityAggregation = async () => {
  try {
    await connectDB();
    // Use aggregation to group by commodity and sum the bagsIn field.
    const aggregation = await Handling.aggregate([
      {
        $group: {
          _id: "$commodity",
          totalBagsIn: { $sum: "$bagsIn" },
        },
      },
    ]);

    // Map the aggregation result into the format expected by CommodityChart.
    const chartData = aggregation.map((item) => ({
      seed: item._id,
      quantity: item.totalBagsIn,
      fill: commodityColors[item._id] || "#000000", // Default color if none defined
    }));

    return chartData;
  } catch (error) {
    console.error("Error aggregating commodity data:", error);
    return [];
  }
};
