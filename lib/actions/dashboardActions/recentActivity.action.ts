import { db } from '@/db';
import { deposit } from '@/db/schema/deposit';
import { handling } from '@/db/schema/handling';
import { dispatch } from '@/db/schema/dispatch';
import { desc, sql } from 'drizzle-orm';
import { warehouseReceipt } from '@/db/schema/warehouse-receipt';
import { eq } from 'drizzle-orm/expressions';

export interface Activity {
  id: string;
  type: 'deposit' | 'handling' | 'dispatch';
  name: string;
  commodity: string;
  volume: number;
  moisture: number | null;
  noOfBags: number;
  date: Date;
}


interface WarehouseReceiptType {
  id: number;
  commodity: string;
}

export async function getRecentActivities(): Promise<Activity[]> {

  type DepositWithReceipt = {
    id: string;  
    warehouseReceiptId: string | null;  
    depositorId: string;
    netWeight: string; 
    moisture: string; 
    incomingBags: number;
    createdAt: Date;
    receiptDetails: WarehouseReceiptType | null;
  };
  
  type HandlingWithReceipt = {
    id: string;
    warehouseReceiptId: string | null;
    netWeight: string;
    moisture: string | null;
    noOfBags: number;
    createdAt: Date;
    receiptDetails: WarehouseReceiptType | null;
  };
  
  type DispatchWithReceipt = {
    id: string;
    warehouseReceiptId: string | null;
    drawDownId: string;
    netWeight: string;
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
      receiptDetails: {
        id: warehouseReceipt.id,
        commodity: warehouseReceipt.commodityGroup, 
      }
    })
    .from(deposit)
    .leftJoin(warehouseReceipt, eq(deposit.warehouseReceiptId, warehouseReceipt.id))
    .orderBy(desc(deposit.createdAt))
    .limit(5)
    .execute() as Promise<DepositWithReceipt[]>,
  
    db.select({
      id: handling.id,
      warehouseReceiptId: handling.warehouseReceiptId,
      netWeight: handling.netWeight,
      moisture: handling.moisture,
      noOfBags: handling.noOfBags,
      createdAt: handling.createdAt,
      receiptDetails: {
        id: warehouseReceipt.id,
        commodity: warehouseReceipt.commodityGroup,
      }
    })
    .from(handling)
    .leftJoin(warehouseReceipt, eq(handling.warehouseReceiptId, warehouseReceipt.id))

    .orderBy(desc(handling.createdAt))
    .limit(5)
    .execute() as Promise<HandlingWithReceipt[]>,
  
    db.select({
      id: dispatch.id,
      warehouseReceiptId: dispatch.warehouseReceiptId,
      drawDownId: dispatch.drawDownId,
      netWeight: dispatch.netWeight,
      noOfBags: dispatch.noOfBags,
      createdAt: dispatch.createdAt,
      receiptDetails: {
        id: warehouseReceipt.id,
        commodity: warehouseReceipt.commodityGroup,
      }
    })
    .from(dispatch)
    .leftJoin(warehouseReceipt, eq(dispatch.warehouseReceiptId, warehouseReceipt.id))

    .orderBy(desc(dispatch.createdAt))
    .limit(5)
    .execute() as Promise<DispatchWithReceipt[]>
  ]);
  

  const activities: Activity[] = [
    ...deposits.map((doc): Activity => ({
      id: doc.id,
      type: 'deposit',
      name: doc.depositorId,
      commodity: doc.receiptDetails?.commodity ?? 'Unknown Commodity',
      volume: parseFloat(doc.netWeight), 
      moisture: parseFloat(doc.moisture), 
      noOfBags: doc.incomingBags,
      date: doc.createdAt,
    })),
  
    ...handlings.map((doc): Activity => ({
      id: doc.id,
      type: 'handling',
      name: `Handling-${doc.id}`,
      commodity: doc.receiptDetails?.commodity ?? 'Unknown Commodity',
      volume: parseFloat(doc.netWeight), 
      moisture: doc.moisture !== null ? parseFloat(doc.moisture) : null,
      noOfBags: doc.noOfBags,
      date: doc.createdAt,
    })),
  
    ...dispatches.map((doc): Activity => ({
      id: doc.id,
      type: 'dispatch',
      name: doc.drawDownId,
      commodity: doc.receiptDetails?.commodity ?? 'Unknown Commodity',
      volume: parseFloat(doc.netWeight), 
      moisture: null,
      noOfBags: doc.noOfBags,
      date: doc.createdAt,
    }))
  ];
  

  return activities
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
}