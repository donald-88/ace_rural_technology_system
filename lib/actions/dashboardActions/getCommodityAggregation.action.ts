import { db } from '@/db';
import { deposit } from '@/db/schema/deposit';
import { dispatch } from '@/db/schema/dispatch';
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
    // First get total deposits by commodity
    const depositData = await db
      .select({
        commodityGroup: warehouseReceipt.commodityGroup,
        totalDeposits: sql<number>`SUM(${deposit.incomingBags})`,
      })
      .from(deposit)
      .leftJoin(
        warehouseReceipt,
        eq(deposit.warehouseReceiptId, warehouseReceipt.id)
      )
      .groupBy(warehouseReceipt.commodityGroup);

    // Then get total dispatches by commodity
    const dispatchData = await db
      .select({
        commodityGroup: warehouseReceipt.commodityGroup,
        totalDispatches: sql<number>`SUM(${dispatch.noOfBags})`,
      })
      .from(dispatch)
      .leftJoin(
        warehouseReceipt,
        eq(dispatch.warehouseReceiptId, warehouseReceipt.id)
      )
      .groupBy(warehouseReceipt.commodityGroup);

    // Create a map of commodity to dispatch counts
    const dispatchMap = new Map<string, number>();
    dispatchData.forEach((item) => {
      const commodityKey = item.commodityGroup ?? "Unknown Commodity";
      dispatchMap.set(commodityKey, Number(item.totalDispatches) || 0);
    });

    // Calculate net quantities
    const chartData = depositData.map((item) => {
      const commodityKey = item.commodityGroup ?? "Unknown Commodity";
      const depositCount = Number(item.totalDeposits) || 0;
      const dispatchCount = dispatchMap.get(commodityKey) || 0;
      const netCount = Math.max(depositCount - dispatchCount, 0);
      
      return {
        seed: commodityKey,
        quantity: netCount,
        fill: commodityColors[commodityKey] || "#800000", // Fallback color
      };
    });

    return chartData;
  } catch (error) {
    console.error("Error aggregating commodity data:", error);
    return [];
  }
}