import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";

export const deposit = pgTable('deposit', {
    id: text().primaryKey(),
    warehouseReceiptId: text().references(() => warehouseReceipt.id),
    grossWeight: integer().notNull(),
    netWeight: integer().notNull(),
    moisture: integer().notNull(),
    deductions: integer().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});