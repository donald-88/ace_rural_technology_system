import { db } from '@/db';
import { deposit } from '@/db/schema/deposit';
import { warehouseReceipt } from '@/db/schema/warehouse-receipt';
import { sql, eq } from 'drizzle-orm';

// Mapping for commodity colors
const commodityColors: { [key: string]: string } = {
  Maize: "#459428",
  Rice: "#FF9F40",
  Groundnuts: "#0D2535",
  Soya: "#5388D8",
  "Unknown Commodity": "#800000", // Added Unknown Commodity
};

export async function getCommodityAggregation() {
  try {
    const aggregatedData = await db
      .select({
        commodityGroup: warehouseReceipt.commodityGroup,
        totalBags: sql<number>`SUM(${deposit.incomingBags})`,
      })
      .from(deposit)
      .leftJoin(
        warehouseReceipt,
        eq(deposit.warehouseReceiptId, warehouseReceipt.id)
      )
      .groupBy(warehouseReceipt.commodityGroup);

    const chartData = aggregatedData.map((item) => ({
      seed: item.commodityGroup ?? "Unknown Commodity", // Default to Unknown Commodity
      quantity: Number(item.totalBags),
      fill: commodityColors[item.commodityGroup ?? "Unknown Commodity"],
    }));

    return chartData;
  } catch (error) {
    console.error("Error aggregating commodity data:", error);
    return [];
  }
}

