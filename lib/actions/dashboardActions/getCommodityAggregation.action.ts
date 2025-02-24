import { db } from '@/db';
import { deposit } from '@/db/schema/deposit';
import { dispatch, Dispatch } from '@/db/schema/dispatch';
import { warehouseReceipt } from '@/db/schema/warehouse-receipt';
import { sql, eq } from 'drizzle-orm';

const commodityColors: { [key: string]: string } = {
  Maize: "#459428",
  Rice: "#FF9F40",
  Groundnuts: "#0D2535",
  Soya: "#5388D8",
  "Unknown Commodity": "#800000", 
};

export async function getCommodityAggregation() {
  try {
    const aggregatedData = await db
      .select({
        commodityVariety: warehouseReceipt.commodityVariety,
        totalBags: sql<number>`SUM(${deposit.incomingBags}) - COALESCE(SUM(${dispatch.noOfBags}), 0)`,
      })
      .from(deposit)
      .leftJoin(
        warehouseReceipt,
        eq(deposit.warehouseReceiptId, warehouseReceipt.id)
      )
      .leftJoin(
        dispatch,
        eq(deposit.warehouseReceiptId, dispatch.warehouseReceiptId) // Match dispatches to deposits
      )
      .groupBy(warehouseReceipt.commodityVariety);

    const chartData = aggregatedData.map((item) => ({
      seed: item.commodityVariety ?? "Unknown Commodity",
      quantity: Math.max(Number(item.totalBags), 0), // Prevent negative values
      fill: commodityColors[item.commodityVariety ?? "Unknown Commodity"],
    }));

    return chartData;
  } catch (error) {
    console.error("Error aggregating commodity data:", error);
    return [];
  }
}


