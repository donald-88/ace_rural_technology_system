import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";

export const handling = pgTable('handling', {
    id: text().primaryKey(),
    warehouseReceiptId: text().references(() => warehouseReceipt.id),
    deductions: integer().notNull(),
    grossWeight: integer().notNull(),
    netWeight: integer().notNull(),
    noOfBags: integer().notNull(),
    moisture: integer(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});