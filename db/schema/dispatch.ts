import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";

export const dispatch = pgTable('dispatch', {
    id: text().primaryKey(),
    warehouseReceiptId: text().references(() => warehouseReceipt.id),
    drawDownId: text().notNull(),
    noOfBags: integer().notNull(),
    grossWeight: integer().notNull(),
    netWeight: integer().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});