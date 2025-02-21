import { decimal, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";
import { createdAt, id, updatedAt } from "../schema-helper";

export const handling = pgTable('handling', {
    id: id,
    warehouseReceiptId: uuid().references(() => warehouseReceipt.id),
    deductions: decimal("deductions", { precision: 5, scale: 2 }).notNull(),
    netWeight: decimal("net_weight", { precision: 10, scale: 2 }).notNull(),
    noOfBags: integer().notNull(),
    moisture: integer(),
    createdAt: createdAt,
    updatedAt: updatedAt
});

export type Handling = typeof handling.$inferSelect
export type NewHandling = typeof handling.$inferInsert