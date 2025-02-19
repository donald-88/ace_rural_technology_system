import { decimal, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";

export const dispatch = pgTable('dispatch', {
    id: serial("id").primaryKey(),
    warehouseReceiptId: integer().references(() => warehouseReceipt.id),
    drawDownId: text().notNull(),
    noOfBags: integer().notNull(),
    netWeight: decimal("net_weight", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
});

export type Dispatch = typeof dispatch.$inferSelect
export type NewDispatch = typeof dispatch.$inferInsert