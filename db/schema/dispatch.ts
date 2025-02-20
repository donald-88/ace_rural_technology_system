import { decimal, integer, pgTable, text } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";
import { createdAt, id, updatedAt } from "../schema-helper";

export const dispatch = pgTable('dispatch', {
    id: id,
    warehouseReceiptId: integer().references(() => warehouseReceipt.id),
    drawDownId: text().notNull(),
    noOfBags: integer().notNull(),
    netWeight: decimal("net_weight", { precision: 10, scale: 2 }).notNull(),
    createdAt: createdAt,
    updatedAt: updatedAt
});

export type Dispatch = typeof dispatch.$inferSelect
export type NewDispatch = typeof dispatch.$inferInsert