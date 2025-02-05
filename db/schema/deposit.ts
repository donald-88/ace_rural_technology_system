import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";
import { depositor } from "./depositor";

export const deposit = pgTable('deposit', {
    id: text().primaryKey(),
    depositorId: text().references(() => depositor.id),
    warehouseReceiptId: text().references(() => warehouseReceipt.id),
    commodity: text().notNull(),
    variety: text().notNull(),
    grade: integer().notNull(),
    grossWeight: integer().notNull(),
    netWeight: integer().notNull(),
    moisture: integer().notNull(),
    deductions: integer().notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});