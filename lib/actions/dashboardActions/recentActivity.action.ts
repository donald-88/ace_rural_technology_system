import { db } from '@/db';
import { deposit } from '@/db/schema/deposit';
import { handling } from '@/db/schema/handling';
import { dispatch } from '@/db/schema/dispatch';
import { desc, sql } from 'drizzle-orm';
import { warehouseReceipt } from '@/db/schema/warehouse-receipt';

// Update Activity interface to better match our database types
export interface Activity {
  id: number;
  type: 'intake' | 'handling' | 'dispatch';
  name: string;
  commodity: string;
  volume: number;
  moisture: number | null;
  noOfBags: number;
  date: Date;
}

// Define the shape of warehouse receipt for proper typing
interface WarehouseReceiptType {
  id: number;
  commodity: string;
  // Add other fields as needed
}

export async function getRecentActivities(): Promise<Activity[]> {
  // Type the warehouse receipt join results
  type DepositWithReceipt = {
    id: number;
    warehouseReceiptId: number | null;
    depositorId: string;
    netWeight: number | string;
    moisture: number | string;
    incomingBags: number;
    createdAt: Date;
    receiptDetails: WarehouseReceiptType | null;
  };

  type HandlingWithReceipt = {
    id: number;
    warehouseReceiptId: number | null;
    netWeight: number | string;
    moisture: number | null;
    noOfBags: number;
    createdAt: Date;
    receiptDetails: WarehouseReceiptType | null;
  };

  type DispatchWithReceipt = {
    id: number;
    warehouseReceiptId: number | null;
    drawDownId: string;
    netWeight: number | string;
    noOfBags: number;
    createdAt: Date;
    receiptDetails: WarehouseReceiptType | null;
  };

  const [deposits, handlings, dispatches] = await Promise.all([
    db.select({
      id: deposit.id,
      warehouseReceiptId: deposit.warehouseReceiptId,
      depositorId: deposit.depositorId,
      netWeight: deposit.netWeight,
      moisture: deposit.moisture,
      incomingBags: deposit.incomingBags,
      createdAt: deposit.createdAt,
      receiptDetails: warehouseReceipt
    })
    .from(deposit)
    .leftJoin(warehouseReceipt, sql`${deposit.warehouseReceiptId} = ${warehouseReceipt.id}`)
    .orderBy(desc(deposit.createdAt))
    .limit(5) as Promise<DepositWithReceipt[]>,

    db.select({
      id: handling.id,
      warehouseReceiptId: handling.warehouseReceiptId,
      netWeight: handling.netWeight,
      moisture: handling.moisture,
      noOfBags: handling.noOfBags,
      createdAt: handling.createdAt,
      receiptDetails: warehouseReceipt
    })
    .from(handling)
    .leftJoin(warehouseReceipt, sql`${handling.warehouseReceiptId} = ${warehouseReceipt.id}`)
    .orderBy(desc(handling.createdAt))
    .limit(5) as Promise<HandlingWithReceipt[]>,

    db.select({
      id: dispatch.id,
      warehouseReceiptId: dispatch.warehouseReceiptId,
      drawDownId: dispatch.drawDownId,
      netWeight: dispatch.netWeight,
      noOfBags: dispatch.noOfBags,
      createdAt: dispatch.createdAt,
      receiptDetails: warehouseReceipt
    })
    .from(dispatch)
    .leftJoin(warehouseReceipt, sql`${dispatch.warehouseReceiptId} = ${warehouseReceipt.id}`)
    .orderBy(desc(dispatch.createdAt))
    .limit(5) as Promise<DispatchWithReceipt[]>
  ]);

  const activities: Activity[] = [
    ...deposits.map((doc): Activity => ({
      id: doc.id,
      type: 'intake',
      name: doc.depositorId,
      commodity: doc.receiptDetails?.commodity ?? 'Unknown Commodity',
      volume: Number(doc.netWeight),
      moisture: Number(doc.moisture),
      noOfBags: doc.incomingBags,
      date: doc.createdAt,
    })),

    ...handlings.map((doc): Activity => ({
      id: doc.id,
      type: 'handling',
      name: `Handling-${doc.id}`,
      commodity: doc.receiptDetails?.commodity ?? 'Unknown Commodity',
      volume: Number(doc.netWeight),
      moisture: doc.moisture !== null ? Number(doc.moisture) : null,
      noOfBags: doc.noOfBags,
      date: doc.createdAt,
    })),

    ...dispatches.map((doc): Activity => ({
      id: doc.id,
      type: 'dispatch',
      name: doc.drawDownId,
      commodity: doc.receiptDetails?.commodity ?? 'Unknown Commodity',
      volume: Number(doc.netWeight),
      moisture: null,
      noOfBags: doc.noOfBags,
      date: doc.createdAt,
    }))
  ];

  return activities
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
}