import { decimal, integer, pgTable, text } from "drizzle-orm/pg-core";
import { warehouseReceipt } from "./warehouse-receipt";
import { createdAt, updatedAt } from "../schema-helper";
import { relations } from "drizzle-orm";
import { weightEntries } from "./weightEntries";

export const handling = pgTable('handling', {
    id: text('id').primaryKey().notNull(),
    warehouseReceiptId: text().references(() => warehouseReceipt.id),
    deductions: decimal("deductions", { precision: 5, scale: 2 }).notNull(),
    netWeight: decimal("net_weight", { precision: 10, scale: 2 }).notNull(),
    noOfBags: integer().notNull(),
    moisture: integer(),
    createdAt: createdAt,
    updatedAt: updatedAt
});

// Handling Relations
export const handlingRelations = relations(handling, ({ one }) => ({
    warehouseReceipt: one(warehouseReceipt, {
        fields: [handling.warehouseReceiptId],
        references: [warehouseReceipt.id]
    }),
    weightEntries: one(weightEntries)
}))

export type Handling = typeof handling.$inferSelect
export type NewHandling = typeof handling.$inferInsert